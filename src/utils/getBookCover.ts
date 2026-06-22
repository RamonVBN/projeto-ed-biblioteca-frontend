
type GetBookCoverProps = {
    isbn: string
    size: 'S' | 'M'
}

export async function getBookCover({ isbn, size }: GetBookCoverProps){

     const openLibraryUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`

    try {
        const response = await fetch(openLibraryUrl, {
            method: "HEAD",
        })

    if (response.ok) {
        return openLibraryUrl
    }
    } catch {
    // falha silenciosa → continua fallback
        return undefined
    }
}