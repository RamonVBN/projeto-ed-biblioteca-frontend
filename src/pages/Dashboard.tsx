import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { api } from "@/libs/axios"
import { useEffect, useState } from "react"

type LibReportResponseBook = {

    ano_pub: number
    autor: string
    isbn: string,
    qtd_disp: number
    qtd_ex: number
    tam_fila: number
    titulo: string
}

type NormalizedLibReportBook = {
    title: string
    author: string
    isbn: string
    publishYear: number
    availableQuantity: number
    totalQuantity: number
}


export function Dashboard(){

    const [libReport, setLibReport] = useState<NormalizedLibReportBook[] | null>(null)

    async function getLibReport(){

        const response = await api.get('/relatorio')

        const report: LibReportResponseBook[] = response.data.report[0]

        const normalizedReport: NormalizedLibReportBook[] = report.map((book) => {

            return {
                title: book.titulo,
                author: book.autor,
                isbn: book.isbn,
                publishYear: book.ano_pub,
                availableQuantity: book.qtd_disp,
                totalQuantity: book.qtd_ex,
            }
        })

        setLibReport(normalizedReport)  
    }

    
    const dashboardStats = libReport && libReport.reduce((acc, current) => {


        return {
            libTotalQuantity: acc.libTotalQuantity +=  current.totalQuantity,
            libTotalAvailableQuantity: acc.libTotalAvailableQuantity += current.availableQuantity,  
            libTotalBorrowedQuantity: acc.libTotalBorrowedQuantity += (current.totalQuantity - current.availableQuantity),
            oldestBook: current.publishYear < acc.oldestBook.publishYear ? current : acc.oldestBook,
            newestBook: current.publishYear > acc.newestBook.publishYear ? current : acc.newestBook
        }   
    }, 
    {
        libTotalQuantity: 0, 
        libTotalAvailableQuantity: 0,
        libTotalBorrowedQuantity: 0,
        oldestBook: libReport[0],
        newestBook: libReport[0]
    })
    

    useEffect(() => {
        getLibReport()
    }, [])

    return (
        <div className="flex gap-4 items-start">
            <Card className="p-8">
                <CardTitle className="text-xl">Total de livros do acervo:</CardTitle>
                <CardContent className="p-0">
                    <span className="text-[18px]">
                        {dashboardStats?.libTotalQuantity}
                    </span>
                </CardContent>
            </Card>

            <Card className="p-8">
                <CardTitle className="text-xl" >Livros disponíveis:</CardTitle>
                <CardContent className="p-0">
                    <span className="text-[18px]">
                        {dashboardStats?.libTotalAvailableQuantity}
                    </span>
                </CardContent>
            </Card>

            <Card className="p-8">
                <CardTitle className="text-xl" >Livros emprestados:</CardTitle>
                <CardContent className="p-0">
                    <span className="text-[18px]">
                        {dashboardStats?.libTotalBorrowedQuantity}
                    </span>
                </CardContent>
            </Card>

            <Card className="p-8">
                <CardTitle className="text-xl" >Livro mais antigo:</CardTitle>
                <CardContent className="p-0">
                    <div className="flex flex-col gap-3">   
                        <span>ISBN: {dashboardStats?.oldestBook.isbn}</span>
                        <span>Título: {dashboardStats?.oldestBook.title}</span>
                        <span>Autor: {dashboardStats?.oldestBook.author}</span>
                        <span>Ano: {dashboardStats?.oldestBook.publishYear}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="p-8">
                <CardTitle className="text-xl" >Livro mais recente:</CardTitle>
                <CardContent className="p-0">
                     <div className="flex flex-col gap-3">   
                        <span>ISBN: {dashboardStats?.newestBook.isbn}</span>
                        <span>Título: {dashboardStats?.newestBook.title}</span>
                        <span>Autor: {dashboardStats?.newestBook.author}</span>
                        <span>Ano: {dashboardStats?.newestBook.publishYear}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}