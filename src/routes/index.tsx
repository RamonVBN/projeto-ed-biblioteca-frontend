import { Layout } from "@/components/Layout";
import { BooksList } from "@/pages/BooksList";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { RegisterBook } from "@/pages/RegisterBook";
import { SearchBook } from "@/pages/SearchBook";
import { createBrowserRouter } from "react-router-dom";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "books",
        element: <BooksList />,
      },
      {
        path: "register",
        element: <RegisterBook />,
      },
       {
        path: "search",
        element: <SearchBook />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);