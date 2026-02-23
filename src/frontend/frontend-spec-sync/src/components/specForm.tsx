"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function SpecForm() {
    
    const gpuOptions = [
        { label: "GPU2", value: "gp1" },
        { label: "GPU3", value: "gp2" },
        { label: "GPU4", value: "gp3" },
    ]

    const processorOptions = [
        { label: "P2", value: "p1" },
        { label: "P3", value: "p2" },
        { label: "P4", value: "p3" },
    ]

    const genreOptions = [
        { label: "G2", value: "G2" },
        { label: "G3", value: "G3" },
        { label: "G4", value: "G4" },
    ]
    const formSchema = z.object({
    title: z
        .string(),
    gpu: z
        .string(),
    processor: z
        .string(),
    genre: z
        .string()
    
    })

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title: "",
        gpu: "",
        processor: "",
    },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("The api call will be made here with", data);
        // we will pass the result here to
        // setResult() state handler
    }

    return (
    <Card id="left-side" className=" text-white w-full h-200 border-gray-900 md:w-[30%] bg-neutral-900 border-2 rounded-md p-4 font-semibold" >
        <CardHeader className="font-semibold text-lg">Enter Your Specs</CardHeader>
        <CardContent>
            <form id="form-rhf-specs" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller 
                    name="gpu"
                    control={form.control}
                    render={({ field, fieldState}) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor="form-rhf-select-gpu">
                                    <i className="bi bi-laptop"></i>
                                    Graphics Card
                                </FieldLabel>
                                <FieldDescription>
                                    Select the GPU you use
                                </FieldDescription>
                            </FieldContent>
                            <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                id="form-rhf-select-gpu"
                                aria-invalid={fieldState.invalid}
                                className="min-w-30">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpu">GPU0</SelectItem>

                                    <SelectSeparator />

                                    {gpuOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>

                        </Field>
                    )}
                    />
                    <Controller 
                    name="processor"
                    control={form.control}
                    render={({ field, fieldState}) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor="form-rhf-select-processor">
                                    <i className="bi bi-cpu"></i>
                                    Processor
                                </FieldLabel>
                                <FieldDescription>
                                    Select the processor you use
                                </FieldDescription>
                            </FieldContent>
                            <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                id="form-rhf-select-processor"
                                aria-invalid={fieldState.invalid}
                                className="min-w-30">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="p0">P0</SelectItem>

                                    <SelectSeparator />

                                    {processorOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>

                        </Field>
                    )}
                    />
                    <Controller 
                    name="genre"
                    control={form.control}
                    render={({ field, fieldState}) => (
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor="form-rhf-select-genre">
                                    <i className="bi bi-memory"></i>
                                    Ram
                                </FieldLabel>
                                <FieldDescription>
                                    Select the RAM
                                </FieldDescription>
                            </FieldContent>
                            <Select
                            name={field.name}
                            value={field.value}
                            onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                id="form-rhf-select-genre"
                                aria-invalid={fieldState.invalid}
                                className="min-w-30">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="g0">G0</SelectItem>

                                    <SelectSeparator />

                                    {genreOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>

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