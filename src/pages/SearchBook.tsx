import type { Book } from "@/@types/query";
import { BookCover } from "@/components/BookCover";
import { BorrowDialog } from "@/components/BorrowDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/libs/axios";
import { getBookCover } from "@/utils/getBookCover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const searchBookFormSchema = z.object({
    isbn: z.string()
})

type searchBookFormData = z.infer<typeof searchBookFormSchema>

export function SearchBook(){

    const [isbn, setIsbn] = useState("")

    const {
        register,
        handleSubmit,
      } = useForm({
        resolver: zodResolver(searchBookFormSchema),
      })

    async function handleSearchBook(data: searchBookFormData){

       setIsbn(data.isbn)
    }

    const { data: searchedBook } = useQuery<Book | undefined>({

        queryKey: ['books', isbn],
        enabled: isbn.length > 0,
        queryFn: async () => {
            const response = await api.get(`/buscar/${isbn}`)

            const book =  response.data.book
            
            if (!book){
                return
            }

            const coverUrl = await getBookCover({isbn, size: 'M'})

            return {
                title: book.titulo,
                author: book.autor,
                isbn: book.isbn,
                publishYear: book.ano_pub,
                quantity: book.qtd_ex,
                coverUrl
            }
        }
    })

    return (
        <div className="flex flex-col gap-5 min-w-125">
            <Card className="p-8">
                <CardTitle className="text-xl">Buscar livro</CardTitle>

                <CardContent >
                    <form className="flex gap-4" onSubmit={handleSubmit(handleSearchBook)}>
                        <Field>
                            <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
                            <Input id="isbn" {...register("isbn")} />
                        </Field>

                        <Button className="cursor-pointer self-end bg-[#252D4A]">Buscar</Button>
                    </form>
                </CardContent>
            </Card>

            {
                searchedBook && (
                <Card className="p-8">
                    
                    <div className="w-full flex justify-between mb-3">
                        <CardTitle className="text-[18px]">Livro encontrado</CardTitle>
                        
                        <div className="flex gap-1">

                            <BorrowDialog devolution isbn={searchedBook.isbn}>
                                <Button size={'lg'} >Devolver</Button>
                            </BorrowDialog>

                            <BorrowDialog isbn={searchedBook.isbn}>
                                <Button size={'lg'} >Emprestar</Button>
                            </BorrowDialog>
                        </div>
                    </div>
                
                    <CardContent className="flex gap-4 p-0">
                        
                        <BookCover src={searchedBook.coverUrl}/>

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