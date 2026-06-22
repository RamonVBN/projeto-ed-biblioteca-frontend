import { api } from "@/libs/axios";
import { BookmarkPlus, BookOpen, BookSearch, LayoutDashboard, LibraryBig } from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const queryClient = new QueryClient()

export function Layout(){
    
    const { pathname } = useLocation()

    async function setInitialMockData() {
        await api.get('/mock')
    }

    useEffect(() => {
       setInitialMockData()
    }, [])

    return (
        
        <div className="w-screen h-screen bg-[#0E1116] text-gray-200 flex py-5 pl-5">

            <div 
            className="
             relative
            bg-[#0B1120]
            before:content-['']
            before:absolute
            before:inset-0
            before:z-0
            before:opacity-75
            before:blur-[160px]
            before:bg-[radial-gradient(circle_at_30%_5%,rgba(129,140,248,0.40),transparent_45%),radial-gradient(circle_at_75%_10%,rgba(168,85,247,0.35),transparent_50%),radial-gradient(circle_at_20%_55%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_40%_90%,rgba(16,185,129,0.20),transparent_50%)]

            *:relative
            *:z-10
            h-full rounded-lg shadow-2xl text-[#F8F9FC] w-1/5 p-5 pt-8 flex flex-col items-center ">

                <div className="flex gap-3 items-center">
                    {/* <BookOpen/>
                    <h1 className="text-xl" >Biblioteca Virtual</h1> */}
                    <img className="w-60 mb-auto" src="/logo.png" alt="" />
                </div>
                <nav className="flex flex-col h-full gap-4 mt-2 text-[#8D95AF]">
                    <Button 
                    asChild
                    variant={'ghost'} 
                    className={`flex gap-3 justify-start text-base hover:text-[#F8F9FC] hover:bg-[#181C2A] 
                        ${pathname === '/' ? ' text-[#F8F9FC]' : ""}`}
                    >
                        <Link to={'/'}>
                            <LayoutDashboard/>
                            Dashboard
                        </Link>
                    </Button>

                     <Button 
                     asChild
                     variant={'ghost'} 
                     className={`flex gap-3 justify-start text-base hover:text-[#F8F9FC] hover:bg-[#181C2A] 
                        ${pathname === '/books' ? ' text-[#F8F9FC]' : ""}`}
                     >
                        
                        <Link to="/books">
                            <LibraryBig/>
                            Livros
                        </Link>
                    </Button>

                     <Button 
                     asChild
                     variant={'ghost'} 
                     className={`flex gap-3 justify-start text-base hover:text-[#F8F9FC] hover:bg-[#181C2A] 
                        ${pathname === '/register' ? ' text-[#F8F9FC]' : ""}`}
                     >
                        <Link to="/register">
                            <BookmarkPlus/>
                            Cadastrar
                        </Link>
                    </Button>

                     <Button 
                     asChild
                     variant={'ghost'} 
                     className={`flex gap-3 justify-start text-base hover:text-[#F8F9FC] hover:bg-[#181C2A] 
                        ${pathname === '/search' ? ' text-[#F8F9FC]' : ""}`}
                     >
                       
                        <Link to="/search">
                            <BookSearch/>
                            Buscar
                        </Link>
                    </Button>
                </nav>
            </div>
            
            <QueryClientProvider client={queryClient}>
                <Toaster richColors/>
                <main className="h-full w-full bg-zinc-850 flex px-12 py-13 justify-center">
                    <Outlet/>
                </main>
            </QueryClientProvider>
        </div>
    )
}