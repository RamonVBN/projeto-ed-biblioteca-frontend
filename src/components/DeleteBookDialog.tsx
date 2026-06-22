import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type DeleteBookDialogProps = {
    children: React.ReactNode
    isbn: string
    deleteBook: (isbn: string) => Promise<void>
}

export function DeleteBookDialog({ children, isbn, deleteBook }: DeleteBookDialogProps){

    const [isDeleteBookDialogOpen, setIsDeleteBookDialogOpen] = useState(false)

    function onDeleteBook() {

        deleteBook(isbn)
        setIsDeleteBookDialogOpen(false)
    }

    return (
        <Dialog open={isDeleteBookDialogOpen} onOpenChange={setIsDeleteBookDialogOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="p-8 gap-5">
                <DialogHeader>
                    <DialogTitle className="text-[18px]">Excluir livro</DialogTitle>
                    <DialogDescription>Deseja realmente excluir este livro?</DialogDescription>
                </DialogHeader>

                    <div className="w-full flex justify-center gap-2">
                        <Button onClick={() => onDeleteBook()} size={'lg'} className="bg-red-500 hover:bg-red-400 transition-all ease-in cursor-pointer">Excluir</Button>
                        <Button onClick={() => setIsDeleteBookDialogOpen(false)} size={'lg'} className="cursor-pointer transition-all ease-in">Cancelar</Button>
                    </div>
            </DialogContent>
        </Dialog>
    )
}