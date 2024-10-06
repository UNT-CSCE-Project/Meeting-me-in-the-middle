import { Card } from "./Card"
export default async function CardGrid() {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 px-3">
                
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
                
        </div>
    )
}