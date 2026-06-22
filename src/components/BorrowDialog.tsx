import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/libs/axios";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

type BorrowDialogProps = {
    children: React.ReactNode
    isbn: string
    devolution?: boolean
}

const borrowDialogFormSchema = z.object({
    name: z.string().min(3)
})

type BorrowDialogFormData = z.infer<typeof borrowDialogFormSchema>

export function BorrowDialog({ children, isbn, devolution=false }: BorrowDialogProps){

     const [isBorrowBookDialogOpen, setIsBorrowBookDialogOpen] = useState(false)

    const {register, handleSubmit, reset} = useForm({
        resolver: zodResolver(borrowDialogFormSchema)
    })

    async function handleUndo(){
        await api.get('/desfazer')
    }

    async function handleBorrowBook(data: BorrowDialogFormData){

        await api.post('/emprestimo', {
            isbn,
            quem: data.name
        })

        setIsBorrowBookDialogOpen(false)
        reset()

        toast.success("Livro emprestado com sucesso.", {
            action: {
                label: 'Desfazer',
                onClick: () => handleUndo()
            }
        })
    }

    async function handleReturnBook(data: BorrowDialogFormData){

        await api.post('/devolver', {
            isbn,
            quem: data.name
        })

        setIsBorrowBookDialogOpen(false)
        reset()
    }

    return (
        <Dialog open={isBorrowBookDialogOpen} onOpenChange={setIsBorrowBookDialogOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="p-8">
                <DialogHeader>
                    <DialogTitle className="text-[18px]">
                        {
                            devolution ? "Devolução de livro" : "Empréstimo de livro"
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {
                            devolution ? "Digite o nome do solicitante para realizar a devolução." : "Digite o nome do solicitante para realizar o empréstimo." 
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(devolution ? handleReturnBook :handleBorrowBook)} className="flex gap-3">
                    <Field>
                        <FieldLabel htmlFor="title">Solicitante</FieldLabel>
                        <Input id="name" {...register("name")} />
                    </Field>

                    <Button size={"lg"} className="self-end cursor-pointer">Enviar</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}