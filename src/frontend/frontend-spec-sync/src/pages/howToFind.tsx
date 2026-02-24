export function HowToFind() {
    return (
        <div className="flex flex-col items-center min-h-[50vh] p-8 text-white w-full">
            <br></br>
            <h1 className="text-4xl font-bold mb-10">How to find your PC specs</h1>

            <div className="max-w-4xl w-full flex flex-col gap-10">
                <section>
                    <h2 className="text-3xl font-semibold mb-4 text-[oklch(0.63_0.17_149)] border-b pb-2 border-slate-700">Windows</h2>

                    <div className="mb-6">
                        <h3 className="text-2xl font-medium mb-3">CPU & RAM</h3>
                        <ol className="list-decimal list-inside space-y-2 text-slate-300 text-lg">
                            <li>Press the windows key and type in <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">System Information</code></li>
                            <li>Under <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">System Summary</code>, next to item <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Processor</code>, you'll find your CPU.</li>
                            <li>Also under <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">System Summary</code>, next to item <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Installed Physical Memory (RAM)</code>, you'll find your RAM.</li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="text-2xl font-medium mb-3">GPU & VRAM</h3>
                        <ol className="list-decimal list-inside space-y-2 text-slate-300 text-lg">
                            <li>Press the windows key and type in <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Task Manager</code></li>
                            <li>On your sidebar, go to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Performance</code> and find your GPU at the bottom. It may have a number associated with it, such as 0 or 1. Your dedicated GPU will have a section titled <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Dedicated GPU memory</code>. That is the GPU you'll be using here, and that is your VRAM.</li>
                            <li>Once the GPU is selected under performance, the GPU name will be visible on the top right corner.</li>
                        </ol>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-semibold mb-4 text-[oklch(0.63_0.17_149)] border-b pb-2 border-slate-700">MacOS</h2>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 text-lg">
                        <li>Holding the <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">option</code> key, click on the Apple icon and select <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">System Information</code>.</li>
                        <li>Next to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Chip</code>, you'll find your CPU. (GPU is integrated, so only GPU necessary.)</li>
                        <li>Next to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Memory</code>, you'll find your RAM.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-3xl font-semibold mb-4 text-[oklch(0.63_0.17_149)] border-b pb-2 border-slate-700">Linux</h2>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 text-lg">
                        <li>Using your desired package manager, install <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">fastfetch</code>.</li>
                        <li>Run <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">fastfetch</code> in your terminal to find system information.</li>
                    </ol>
                </section>
            </div>
        </div>
    );
}
