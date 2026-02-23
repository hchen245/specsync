"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,

} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldDescription
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"

export function SpecForm({ setResults }) {
    const formSchema = z.object({

    gpu: z
        .string(),
    query: z
        .string(),
    cpu: z
        .string(),
    ram: z
        .string(),
    vram: z
        .string(),
    
    })

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        gpu: "",
        query: "",
        cpu: "",
        ram: "",
        vram: "",
    },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("The api call will be made here with", data.gpu);
        const payload = {
            query: data.query,
            cpu_model: data.cpu,
            gpu_model: data.gpu,
            ram: Number(data.ram),
            vram: Number(data.vram),
            top_n: 10,
        }

        try {
            const response = await fetch("http://localhost:8000/search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })

            if (!response.ok) {
                throw new Error("Failed to fetch results")
            }

            const result = await response.json()

            console.log("Search results:", result)
            setResults(result.results);
        } catch (error) {
            console.error("Error:", error)
        }
    }

    return (
    <Card id="left-side" className=" text-white w-full h-200 border-gray-900 md:w-[30%] bg-neutral-900 border-2 rounded-md p-4 font-semibold" >
        <CardHeader className="font-semibold text-lg">Enter Your Specs</CardHeader>
        <CardContent>
            <form id="form-rhf-specs" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>

                    <Controller
                    name="query"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor={field.name}>Query</FieldLabel>

                                <FieldDescription>
                                    Enter query
                                </FieldDescription>
                            </FieldContent>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter Query"
                                autoComplete="off"
                            />

                        </Field>
                    )}
                    />
                    <Controller
                    name="cpu"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor={field.name}>CPU</FieldLabel>

                                <FieldDescription>
                                    Enter CPU
                                </FieldDescription>
                            </FieldContent>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter CPU"
                                autoComplete="off"
                            />

                        </Field>
                    )}
                    />
                    <Controller
                    name="gpu"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor={field.name}>GPU</FieldLabel>

                                <FieldDescription>
                                    Enter gpu
                                </FieldDescription>
                            </FieldContent>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter gpu"
                                autoComplete="off"
                            />

                        </Field>
                    )}
                    />

                    <Controller
                    name="ram"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor={field.name}>Ram</FieldLabel>

                                <FieldDescription>
                                    Enter ram
                                </FieldDescription>
                            </FieldContent>
                            <Input
                                type="number"
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter ram"
                                autoComplete="off"
                            />

                        </Field>
                    )}
                    />
                    <Controller
                    name="vram"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor={field.name}>VRam</FieldLabel>

                                <FieldDescription>
                                    Enter vram
                                </FieldDescription>
                            </FieldContent>
                            <Input
                                type="number"
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter vram"
                                autoComplete="off"
                            />

                        </Field>
                    )}
                    />
                </FieldGroup>
            </form>
        </CardContent>
        <CardFooter className="border-t-0 bg-neutral-900 w-full">
        <Button type="submit" form="form-rhf-specs" className="bg-[oklch(0.63_0.17_149)] text-black w-full h-10 text-md">
            <i className="bi bi-search pr-2"></i>
            Find Games
        </Button>
        </CardFooter>

    </Card>
    )
}