import type { Book } from "@/@types/query";
import { BookCover } from "@/components/BookCover";
import { BorrowDialog } from "@/components/BorrowDialog";
import { DeleteBookDialog } from "@/components/DeleteBookDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/libs/axios";
import { getBookCover } from "@/utils/getBookCover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookMinus, BookPlus, Trash } from "lucide-react";


export function BooksList(){

    const queryClient = useQueryClient()

    async function getBooksList() {

        const response = await api.get('/listar');

        const books = await Promise.all(
            response.data.books.map(async (book: any) => ({
                title: book.titulo,
                author: book.autor,
                quantity: book.qtd_ex,
                publishYear: book.ano_pub,
                isbn: book.isbn,
                coverUrl: await getBookCover({
                    isbn: book.isbn,
                    size: 'S'
                })
            }))
        );

        return books
    }

    const { data: bookList, isLoading } = useQuery<Book[]>({
        queryKey: ['books'],
        queryFn: getBooksList
    })

    async function handleDeleteBook(isbn: string) {

        await api.delete(`/delete/${isbn}`)

        queryClient.invalidateQueries({queryKey: ['books']})
    }

    return (
    <>
       {
        isLoading ? (
            <div className="h-full flex justify-center items-center">
                <Spinner className="size-8"/>
            </div>
        ) : (
            <Card className="p-8 max-h-200 overflow-y-auto">
                <CardTitle className="text-xl mb-4">Livros</CardTitle>
                <CardContent>
                <div className="rounded-md border overflow-hidden">
                    <Table className="bg-[#181C2A]">
                        <TableHeader className="sticky top-0 bg-[#181C2A] z-10">
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead className="text-[#E6E8F2]">ISBN</TableHead>
                                <TableHead className="text-[#E6E8F2]">Título</TableHead>
                                <TableHead className="text-[#E6E8F2]">Autor</TableHead>
                                <TableHead className="text-[#E6E8F2]">Quantidade</TableHead>
                                <TableHead className="text-[#E6E8F2]">Ano de Publicação</TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                bookList && bookList.map((book) => {

                                    return (
                                        <TableRow key={book.isbn}>
                                            <TableCell className="mr-auto">
                                                <BookCover size="S" src={book.coverUrl} />
                                            </TableCell>
                                            <TableCell>{book.isbn}</TableCell>
                                            <TableCell>{book.title}</TableCell>
                                            <TableCell>{book.author}</TableCell>
                                            <TableCell>{book.quantity}</TableCell>
                                            <TableCell>{book.publishYear}</TableCell>

                                            <TableCell>
                                                <BorrowDialog isbn={book.isbn}>
                                                    <Button  className="cursor-pointer">
                                                        <BookMinus/>
                                                    </Button>
                                                </BorrowDialog>
                                            </TableCell>

                                            <TableCell>
                                                <BorrowDialog devolution isbn={book.isbn}>
                                                    <Button className="cursor-pointer">
                                                        <BookPlus/>
                                                    </Button>
                                                </BorrowDialog>
                                            </TableCell>

                                            <TableCell>
                                                <DeleteBookDialog isbn={book.isbn} deleteBook={handleDeleteBook}>
                                                    <Button className="cursor-pointer text-red-400" >
                                                        <Trash/>
                                                    </Button>
                                                </DeleteBookDialog>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
        )
       }
    </>
    )
}