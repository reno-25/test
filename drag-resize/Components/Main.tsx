"use client";

import FreeDragResizeBox from "./FreeDragResizeBox";
import { useState, useEffect } from "react";

export default function Main() {
    const [boxData, setBoxData] = useState<
        { id: string; x: number; y: number; width: number; height: number }[]
    >([]);

    // ambil data awal dari database
    useEffect(() => {
        (async () => {
            const res = await fetch("/api/boxes");
            if (res.ok) {
                const data = await res.json();

                // Konversi jika masih dalam pixel
                const parent = document.body.getBoundingClientRect();
                const converted = data.map((b: any) => ({
                    ...b,
                    x: (b.x / parent.width) * 100,
                    y: (b.y / parent.height) * 100,
                    width: (b.width / parent.width) * 100,
                    height: (b.height / parent.height) * 100,
                }));

                setBoxData(converted);
            }
        })();
    }, []);


    // update posisi/ukuran kotak
    const handleChange = (data: { id: string; x: number; y: number; width: number; height: number }) => {
        setBoxData((prev) =>
            prev.map((b) => (b.id === data.id ? { ...b, ...data } : b))
        );
    };

    // simpan semua perubahan ke database
    const handleSave = async () => {
        try {
            const res = await fetch('/api/boxes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(boxData),
            });

            if (res.ok) {
                alert('Perubahan berhasil disimpan ke database!');
            } else {
                alert('Gagal menyimpan ke database.');
            }
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan saat menyimpan.');
        }
    };

    return (
        <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
            {/* Tombol Save */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
                <button
                    onClick={() => {
                        const newId = `box-${Date.now()}`;
                        setBoxData([...boxData, { id: newId, x: 10, y: 10, width: 20, height: 20 }]);
                    }}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
                >
                    Add Box
                </button>
            </div>

            {/* Kotak yang bisa di-drag dan resize */}
            {boxData.map((box) => (
                <FreeDragResizeBox
                    key={box.id}
                    id={box.id}
                    initialX={box.x}
                    initialY={box.y}
                    initialWidth={box.width}
                    initialHeight={box.height}
                    onChange={handleChange}
                    bounds="parent"
                />
            ))}
        </div>
    );
}
