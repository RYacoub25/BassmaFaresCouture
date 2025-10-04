import * as React from "react"
import Example1 from "../public/Example1.png"
import Example2 from "../public/Example2.png"
import Example3 from "../public/Example3.png"
import { Card, CardContent } from "./components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./components/ui/carousel"

export function CarouselDemo() {
    return (
        <Carousel className="w-full max-w-xs ">
            <CarouselContent className="flex items-center">
                <CarouselItem key={1}>
                    <div className="p-1">
                        <Card>
                            <CardContent className="flex  aspect-square items-center justify-center">
                                <img src={Example1} className="w-full h-full" alt="" />
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
                <CarouselItem key={2}>
                    <div className="p-1">
                        <Card>
                            <CardContent className="flex self-center aspect-square items-center justify-center">
                                <img src={Example2} alt="" />
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
                <CarouselItem key={3}>
                    <div className="p-1">
                        <Card>
                            <CardContent className="flex aspect-square items-center justify-center">
                                <img src={Example3} alt="" />
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>

            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
