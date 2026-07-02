"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

export function AnimatedCounter({
  end,
  duration = 2.2,
  prefix = "",
  suffix = "",
  separator = " ",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref}>
      {start ? (
        <CountUp
          end={end}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          separator={separator}
        />
      ) : (
        <>{prefix}0{suffix}</>
      )}
    </span>
  );
}
