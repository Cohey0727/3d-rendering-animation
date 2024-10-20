"use client";
import { useRef, useEffect, useState, useMemo, CSSProperties } from "react";

type ParallaxProps = {
  children: (progress: number) => React.ReactNode;
  frame: number;
  anchor?: "top" | "bottom";
};

type ParallaxPosition = "top" | "sticky" | "bottom";

const Parallax = (props: ParallaxProps) => {
  const { children, frame, anchor = "top" } = props;
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [parallaxPosition, setParallaxPosition] =
    useState<ParallaxPosition>("top");
  const [innerStyle, setInnerStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const updateInnerStyle = () => {
      if (containerRef.current) {
        const computedStyle = window.getComputedStyle(containerRef.current);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        const containerWidth =
          containerRef.current.getBoundingClientRect().width;

        setInnerStyle({
          width: `${containerWidth - paddingLeft - paddingRight}px`,
          left: `${paddingLeft}px`,
          right: `${paddingRight}px`,
        });
      }
    };

    updateInnerStyle();
    window.addEventListener("resize", updateInnerStyle);
    return () => window.removeEventListener("resize", updateInnerStyle);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const containerHeight =
        containerRef.current?.getBoundingClientRect().height;
      const refTop = containerRef.current?.getBoundingClientRect().top || 0;
      const refBottom =
        containerRef.current?.getBoundingClientRect().bottom || 0;

      if (refTop > 0) {
        setParallaxPosition("top");
      } else if (refBottom < window.innerHeight) {
        setParallaxPosition("bottom");
      } else {
        setParallaxPosition("sticky");
      }
      if (containerHeight) {
        if (anchor === "top") {
          const progress = Math.min(Math.max(0, -refTop / containerHeight), 1);
          setProgress(progress);
        } else {
          setProgress(
            Math.min(
              Math.max(0, (-refBottom + windowHeight) / containerHeight),
              1
            )
          );
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [anchor]);

  const parallaxStyle = useMemo<CSSProperties>(() => {
    if (parallaxPosition === "top") {
      return {
        position: "absolute",
        top: 0,
      };
    } else if (parallaxPosition === "bottom") {
      return {
        position: "absolute",
        top: "auto",
        bottom: 0,
      };
    } else {
      return {
        position: "fixed",
        top: 0,
      };
    }
  }, [parallaxPosition]);

  return (
    <div
      ref={containerRef}
      style={{
        height: `${frame * 100}vh`,
        position: "relative",
      }}
    >
      <div
        ref={innerRef}
        style={{
          height: `${Math.min(frame, 1) * 100}vh`,
          ...parallaxStyle,
          ...innerStyle,
        }}
      >
        {children(progress)}
      </div>
    </div>
  );
};

export type { ParallaxProps };
export default Parallax;
