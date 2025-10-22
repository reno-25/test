"use client";

import FreeDragResizeBox from "./FreeDragResizeBox";
import { useState, useEffect } from "react";

type ISize = { x: number; y: number; width: number; height: number };
type IBox = {
    id: string;
    size: {
        sm: ISize;
        md: ISize;
        lg: ISize;
        default: ISize;
    };
};
export default function Main() {
    const [boxData, setBoxData] = useState<IBox[]>([]);
    const [breakpoint, setBreakpoint] = useState<"sm" | "md" | "lg">("md");

    // 🔹 Deteksi ukuran layar realtime
    useEffect(() => {
        const checkBreakpoint = () => {
            const width = window.innerWidth;
            if (width < 640) setBreakpoint("sm");
            else if (width < 1024) setBreakpoint("md");
            else setBreakpoint("lg");
        };
        checkBreakpoint();
        window.addEventListener("resize", checkBreakpoint);
        return () => window.removeEventListener("resize", checkBreakpoint);
    }, []);

    // 🔹 Ambil data dari DB
    useEffect(() => {
        (async () => {
            const res = await fetch("/api/boxes");
            if (res.ok) {
                const data = await res.json();
                setBoxData(data);
            } else {
                console.warn("Gagal memuat data box");
            }
        })();
    }, []);

    // 🔹 Update posisi/ukuran per breakpoint
    const handleChange = (data: {
        id: string;
        breakpoint: "sm" | "md" | "lg" | "default";
        x: number;
        y: number;
        width: number;
        height: number;
    }) => {
        setBoxData((prev) =>
            prev.map((b) =>
                b.id === data.id
                    ? {
                        ...b,
                        size: {
                            ...b.size,
                            [data.breakpoint]: {
                                x: data.x,
                                y: data.y,
                                width: data.width,
                                height: data.height,
                            },
                        },
                    }
                    : b
            )
        );
    };

    // 🔹 Simpan semua perubahan
    const handleSave = async () => {
        try {
            const res = await fetch("/api/boxes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(boxData),
            });
            if (res.ok) {
                alert(`Perubahan untuk layout "${breakpoint}" berhasil disimpan!`);
            } else {
                alert("Gagal menyimpan ke database.");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat menyimpan.");
        }
    };

    // 🔹 Tambah box baru
    const handleAddBox = () => {
        const newBox: IBox = {
            id: `box-${Date.now()}`,
            size: {
                default: { x: 100, y: 100, width: 200, height: 150 },
                sm: { x: 50, y: 50, width: 180, height: 120 },
                md: { x: 100, y: 100, width: 200, height: 150 },
                lg: { x: 150, y: 150, width: 220, height: 160 },
            },
        };

        setBoxData((prev) => [...prev, newBox]);
    };

    return (
        <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
            {/* 🔹 Tombol Save dan Info Breakpoint */}
            <div className="absolute top-4 left-4 z-10 flex gap-2 items-center">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Save {breakpoint.toUpperCase()}
                </button>
                <button
                    onClick={handleAddBox}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                >
                    + Add Box
                </button>
                <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded-lg shadow">
                    {breakpoint.toUpperCase()} view
                </span>
            </div>

            {/* 🔹 Box yang bisa drag & resize */}
            {boxData.map((box) => {
                const s = box.size[breakpoint] || box.size.default;
                return (
                    <FreeDragResizeBox
                        key={box.id}
                        id={box.id}
                        sizeData={box.size} // ⬅️ kirim seluruh objek size
                        onChange={handleChange}
                        bounds="parent"
                    />
                );
            })}
        </div>
    );
}