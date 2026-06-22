import type { Book } from "@/@types/query";
import { BorrowDialog } from "@/components/BorrowDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/libs/axios";
import { getBookCover } from "@/utils/getBookCover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";


const searchBookFormSchema = z.object({
    isbn: z.string()
})

type searchBookFormData = z.infer<typeof searchBookFormSchema>


export function SearchBook(){

    const [searchedBook, setSearchedBook] = useState<Book | null>(null)

    const {
        register,
        handleSubmit,
      } = useForm({
        resolver: zodResolver(searchBookFormSchema),
      })

    async function handleSearchBook(data: searchBookFormData){

        const response = await api.get(`/buscar/${data.isbn}`)

        const book =  response.data.book
        const message = response.data.message

        if (!book){
            return
        }

        const coverUrl = await getBookCover({isbn: data.isbn, size: 'M'})

        return setSearchedBook({
            title: book.titulo,
            author: book.autor,
            isbn: book.isbn,
            publishYear: book.ano_pub,
            quantity: book.qtd_ex,
            coverUrl
        })
    }


    return (
        <div className="flex flex-col gap-5">
            <Card className="p-8">
                <CardTitle>Buscar livro</CardTitle>

                <CardContent>
                    <form className="flex gap-4" onSubmit={handleSubmit(handleSearchBook)}>
                        <Field>
                            <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
                            <Input id="isbn" {...register("isbn")} />
                        </Field>

                        <Button className="cursor-pointer self-end">Buscar</Button>
                    </form>
                </CardContent>
            </Card>

            {
                searchedBook && (
                <Card className="p-8 w-125">
                    
                    <div className="w-full flex justify-between">
                        <CardTitle className="text-xl">Livro encontrado</CardTitle>
                        
                        <div className="flex gap-1">

                            <BorrowDialog devolution isbn={searchedBook.isbn}>
                                <Button size={'lg'} className="cursor-pointer">Devolver</Button>
                            </BorrowDialog>

                            <BorrowDialog isbn={searchedBook.isbn}>
                                <Button size={'lg'} className="cursor-pointer">Emprestar</Button>
                            </BorrowDialog>
                        </div>
                    </div>
                
                    <CardContent className="flex gap-4 p-0">

                        <img src={searchedBook.coverUrl} alt="" className="justify-self-start" />

                        <div className=" flex flex-col justify-between w-full">
                            <div className="flex flex-col">
                                <span className="font-bold text-base">{searchedBook.title}</span>
                                <span className="">{searchedBook.author}</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between gap-4">
                                    <span>ISBN</span>
                                    <span>{searchedBook.isbn}</span>
                                </div>
                                
                                <div className="flex justify-between gap-4">
                                    <span>Ano de publicação</span>
                                    <span>{searchedBook.publishYear}</span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span>Quantidade</span>
                                    <span>{searchedBook.quantity}</span>
                                </div>
                                    
                            </div>
                            
                        </div>                    
                    </CardContent>
                
                </Card>
                )
            }
            
        </div>
    )
}