'use client';

import React, { useEffect, useRef } from 'react';

export default function HarmonicCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // --- Configuration ---
        const STRAND_COUNT = 12;      // Number of lines in the cable
        const HISTORY_LENGTH = 30;    // Reduced history for segment drawing optimization
        const BASE_RADIUS = 30;       // How wide the cable spreads
        const SPEED_MULTIPLIER = 0.3; // Physics follow speed

        // --- State ---
        let width = 0;
        let height = 0;
        let frame = 0;

        // Mouse state
        const mouse = { x: 0, y: 0, vX: 0, vY: 0 };
        const target = { x: 0, y: 0 };

        // --- Class Definition ---
        class Strand {
            index: number;
            x: number;
            y: number;
            history: { x: number; y: number }[];
            lag: number;       
            phaseOffset: number; 

            constructor(index: number) {
                this.index = index;
                this.x = width / 2;
                this.y = height / 2;
                this.history = [];
                this.lag = 0.1 + (index / STRAND_COUNT) * 0.05;
                this.phaseOffset = (index / STRAND_COUNT) * Math.PI * 2;
            }

            update() {
                const orbitRadius = BASE_RADIUS + Math.sin(frame * 0.05 + this.phaseOffset) * 10;
                const orbitX = target.x + Math.cos(frame * 0.02 + this.phaseOffset) * orbitRadius;
                const orbitY = target.y + Math.sin(frame * 0.02 + this.phaseOffset) * orbitRadius;

                this.x += (orbitX - this.x) * this.lag;
                this.y += (orbitY - this.y) * this.lag;

                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > HISTORY_LENGTH) {
                    this.history.shift();
                }
            }

            draw(context: CanvasRenderingContext2D) {
                if (this.history.length < 2) return;

                const speed = Math.abs(mouse.vX) + Math.abs(mouse.vY);
                const hue = (frame * 2 + this.index * (360 / STRAND_COUNT)) % 360;
                // Kept darker so it's visible on white
                const lightness = 40 + Math.min(speed * 0.5, 20);

                context.lineWidth = 1.5;
                context.lineCap = 'round';
                context.lineJoin = 'round';

                // Ensure it's source-over not lighter, to prevent it from washing out on white backgrounds
                context.globalCompositeOperation = 'source-over';

                for (let i = 1; i < this.history.length; i++) {
                    context.beginPath();
                    context.moveTo(this.history[i - 1].x, this.history[i - 1].y);
                    context.lineTo(this.history[i].x, this.history[i].y);
                    
                    // Alpha gradient from tail to head
                    const alpha = i / this.history.length;
                    context.strokeStyle = `hsla(${hue}, 80%, ${lightness}%, ${alpha})`;
                    
                    // Add slight glow to the leading points only for performance
                    if (i === this.history.length - 1) {
                        context.shadowBlur = 5;
                        context.shadowColor = `hsla(${hue}, 80%, 40%, 0.5)`;
                    } else {
                        context.shadowBlur = 0;
                    }

                    context.stroke();
                }
                
                context.shadowBlur = 0;
            }
        }

        let strands: Strand[] = [];

        const initStrands = () => {
            strands = [];
            for (let i = 0; i < STRAND_COUNT; i++) {
                strands.push(new Strand(i));
            }
        };

        // --- Main Loop ---
        let animationId: number;
        const animate = () => {
            if (width === 0 || height === 0) {
                handleResize();
            }

            mouse.vX = (target.x - mouse.x) * 0.1;
            mouse.vY = (target.y - mouse.y) * 0.1;
            
            if (isNaN(mouse.vX)) mouse.vX = 0;
            if (isNaN(mouse.vY)) mouse.vY = 0;

            mouse.x += mouse.vX;
            mouse.y += mouse.vY;

            frame++;

            // Clear the canvas COMPLETELY instead of a black overlay 
            // NOTE: We don't use fillRect(0,0,width,height) so the dashboard stays visible!
            ctx.clearRect(0, 0, width, height);

            strands.forEach(strand => {
                strand.update();
                strand.draw(ctx);
            });

            animationId = requestAnimationFrame(animate);
        };

        // --- Events ---
        const handleResize = () => {
            width = window.innerWidth || document.documentElement.clientWidth || 1000;
            height = window.innerHeight || document.documentElement.clientHeight || 1000;
            canvas.width = width;
            canvas.height = height;

            if (target.x === 0 && target.y === 0) {
                target.x = width / 2;
                target.y = height / 2;
                mouse.x = width / 2;
                mouse.y = height / 2;
            }
            
            if (strands.length === 0) {
                initStrands();
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            target.x = e.clientX;
            target.y = e.clientY;
        };

        // --- Setup ---
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        handleResize(); 
        initStrands();  
        animate();      

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    // pointer-events-none completely prevents blocking clicks to elements beneath it!
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-50 m-0 p-0 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
            />
        </div>
    );
}
