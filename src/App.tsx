import {dump, type IExif, insert, TagValues} from "exif-library";

function addInfoToImage(formData: FormData) {
    const data = {
        image: formData.get("image") as File,
        title: formData.get("title") as string,
        author: formData.get("author") as string,
        description: formData.get("description") as string | null,
        authorUrl: formData.get("author-url") as string | null,
        imageUrl: formData.get("image-url") as string | null,
    }

    const zeroth = {
        [TagValues.ImageIFD.Software]: "just-cite-me",
        [TagValues.ImageIFD.Artist]: data.author,
        [TagValues.ImageIFD.Copyright]: `Image created by ${data.author}${data.authorUrl ? ` (${data.authorUrl})` : ''}`,
        [TagValues.ImageIFD.ImageDescription]: data.title,
    } as unknown;
    const exif = {
        [TagValues.ExifIFD.UserComment]: data.description + "\nImage Source: " + data.imageUrl,
    } as unknown;
    const gps = {} as unknown;

    const exifObj = {"0th": zeroth, "Exif": exif, "GPS": gps} as IExif;

    const reader = new FileReader();
    reader.onload = function (event: ProgressEvent<FileReader>) {
        const inserted = insert(dump(exifObj), event.target!.result as string);


        const image = new Image();
        image.src = inserted;

        const previewContainer = document.getElementById("updated-image");
        if (previewContainer?.firstChild) previewContainer.removeChild(previewContainer.firstChild)
        previewContainer?.prepend(image);

        const downloadLink = document.getElementById("download-image") as HTMLLinkElement;
        if (downloadLink) downloadLink.href = inserted;
    }
    reader.readAsDataURL(data.image);
}

function App() {
    return (<>
            <div className="h-full grid place-items-center">
                <form action={addInfoToImage}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full lg:w-3xl text-lg">

                    <div className="md:col-span-2 flex flex-col gap-y-3 rounded-sm border-1 border-black p-2" id="updated-image">
                        <p>Image will appear here</p>

                        <a className="md:col-span-2 p-2 text-center rounded-sm bg-black active:bg-indigo-800 text-white"
                           id="download-image" download='file.jpeg'>Download</a>
                    </div>

                    <p className="md:col-span-2 pb-6">
                        Add "hidden" image data like the images' author name, their personal site and where that image
                        originates from. Everything here runs locally in your browser. No guarantee that certain
                        platforms won't
                        ignore or even remove this data when uploading.
                    </p>

                    <label htmlFor="image">Image<span className="text-red-500">*</span></label>
                    <input className="p-2 rounded-sm bg-black active:bg-indigo-800 text-white"
                           id="image" name="image" type="file" alt='upload image'
                           autoComplete="name" required
                           accept="image/jpeg"/>

                    <label htmlFor="title">Title<span className="text-red-500">*</span></label>
                    <input className="p-2 rounded-sm border-1 border-black"
                           name="title" type="text"
                           autoComplete="off" required/>

                    <label htmlFor="author">Author<span className="text-red-500">*</span></label>
                    <input className="p-2 rounded-sm border-1 border-black"
                           name="author" type="text"
                           autoComplete="name" required/>

                    <label htmlFor="author-url">Author Url</label>
                    <input className="p-2 rounded-sm border-1 border-black"
                           name="author-url" type="url"
                           autoComplete="off"/>

                    <label htmlFor="image-url">Image Source</label>
                    <input className="p-2 rounded-sm border-1 border-black"
                           name="image-url" type="url"
                           autoComplete="off"/>

                    <label htmlFor="description">Description</label>
                    <textarea className="p-2 rounded-sm border-1 border-black h-32"
                              name="description" autoComplete="off"/>

                    <button className="md:col-span-2 p-2 text-center rounded-sm bg-black active:bg-indigo-800 text-white"
                            type="submit">
                        Create Image
                    </button>
                </form>

            </div>
        </>)
}

export default App
