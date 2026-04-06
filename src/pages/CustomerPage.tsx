import { useEffect, useMemo, useState } from "react"

export default function CustomerPage(): React.JSX.Element {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchAll() {
            const response = await fetch('/api/products');

            if (response.status === 200) {
                const data = await response.json();
                setProducts(data.data);
            }
        }

        fetchAll();
    }, [])

    const productByCategory: Record<string, any[]> =  useMemo(() =>  {

        const tmp: Record<string, any[]> = {};

        products.forEach((product: any) => {

            const category = product.productCategory.name as string;

            if (tmp[category] === undefined) {
                tmp[category] = [];
            }

            tmp[category].push(product);
        })

        return tmp;
    }, [products])

    console.log(productByCategory)

    return (
        <>
            <div className="flex flex-col items-center "><p className="">Customer Page</p></div>
           
        </>
    )
}