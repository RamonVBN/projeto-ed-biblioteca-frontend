import type { Book } from "@/@types/query";
import { BorrowDialog } from "@/components/BorrowDialog";
import { DeleteBookDialog } from "@/components/DeleteBookDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/libs/axios";
import { getBookCover } from "@/utils/getBookCover";
import { BookMinus, BookPlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";


export function BooksList(){

    const [bookList, setBookList] = useState<Book[] | null>(null)

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

        setBookList(books);
    }

    async function handleDeleteBook(isbn: string) {

        await api.delete(`/delete/${isbn}`)

        await getBooksList()   
    }

    useEffect(() => {

        getBooksList()
    }, [])

    return (
        <Card className="p-8">
            <CardTitle className="text-xl">Livros</CardTitle>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Autor</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Ano de Publicação</TableHead>
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
                                            <img src={book.coverUrl}/>
                                        </TableCell>
                                        <TableCell>{book.isbn}</TableCell>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.quantity}</TableCell>
                                        <TableCell>{book.publishYear}</TableCell>

                                        <TableCell>
                                            <BorrowDialog isbn={book.isbn}>
                                                <Button variant={'secondary'} className="cursor-pointer">
                                                    <BookMinus/>
                                                </Button>
                                            </BorrowDialog>
                                        </TableCell>

                                        <TableCell>
                                            <BorrowDialog devolution isbn={book.isbn}>
                                                <Button variant={'secondary'} className="cursor-pointer">
                                                    <BookPlus/>
                                                </Button>
                                            </BorrowDialog>
                                        </TableCell>

                                        <TableCell>
                                            <DeleteBookDialog isbn={book.isbn} deleteBook={handleDeleteBook}>
                                                <Button className="cursor-pointer text-red-500" variant={'secondary'}>
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
            </CardContent>
        </Card>
    )
}