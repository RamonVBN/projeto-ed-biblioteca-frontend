import { api } from "../libs/axios"

import { Card, CardContent, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

import { useForm } from "react-hook-form"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldLabel } from "../components/ui/field"

const registerBookFormSchema = z.object({
  title: z.string(),
  author: z.string(),
  isbn: z.string(),
  publishYear: z
    .string()
    .refine((pubYear) => !isNaN(Number(pubYear)) && Number(pubYear) >= 1),
  quantity: z
    .string()
    .refine((quantity) => !isNaN(Number(quantity)) && Number(quantity) >= 1),
})

type registerBookFormData = z.infer<typeof registerBookFormSchema>

export function RegisterBook() {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerBookFormSchema),
  })

  async function handleRegisterBook(data: registerBookFormData) {
    await api.post("/cadastrar", {
      titulo: data.title,
      autor: data.author,
      isbn: data.isbn,
      qtd_ex: Number(data.quantity),
      ano_pub: Number(data.publishYear),
    })

    reset()
  }

  return (
    <div>
      <Card className="p-8">
        <CardTitle>Cadastrar livro</CardTitle>

        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(handleRegisterBook)}
          >
            <div className="flex flex-col gap-3">
              <Field>
                <FieldLabel htmlFor="title">Título</FieldLabel>
                <Input id="title" {...register("title")} />
              </Field>

              <Field>
                <FieldLabel htmlFor="author">Autor</FieldLabel>
                <Input id="author" {...register("author")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
                <Input id="isbn" {...register("isbn")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="publishYear">Ano de publicação</FieldLabel>
                <Input id="publishYear" {...register("publishYear")} />
                <FieldError>
                  {errors.publishYear && "Digite um ano válido."}
                </FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="quantity">Quantidade</FieldLabel>
                <Input id="quantity" {...register("quantity")} />
                <FieldError>
                  {errors.quantity && "Digite um número válido."}
                </FieldError>
              </Field>
            </div>

            <Button className="cursor-pointer">Cadastrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
