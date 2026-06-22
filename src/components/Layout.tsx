import { api } from "@/libs/axios";
import { BookOpen } from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"


export function Layout(){


    async function setInitialMockData() {
        await api.get('/mock')
    }

    // useEffect(() => {
    //    setInitialMockData()
    // }, [])

    return (
        
        <div className="w-screen h-screen bg-zinc-900 text-gray-200 flex">

            <div className="h-full bg-zinc-50 w-1/5 p-5 pt-8 flex flex-col items-center text-zinc-950">

                <div className="flex gap-3">
                    <BookOpen/>
                    <h1>Biblioteca Virtual</h1>
                </div>
                <nav className="flex flex-col h-full gap-4 mt-5">
                    <button className="flex gap-3">
                        <Link to={'/'}>Dashboard</Link>
                    </button>

                     <button>
                        <Link to="/books">Livros</Link>
                    </button>

                     <button>
                        <Link to="/register">Cadastrar</Link>
                    </button>

                     <button>
                        <Link to="/search">Buscar</Link>
                    </button>

                     {/* <button>
                        <Link href="">Empréstimos</a>
                    </button> */}
                </nav>
            </div>
                    
            <Toaster />
            <main className="h-full w-full bg-zinc-850 flex items-center justify-center ">
                <Outlet/>
            </main>
        </div>
    )
}