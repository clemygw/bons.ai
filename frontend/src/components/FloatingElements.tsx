import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const FloatingElements = () => {
  const [elements, setElements] = useState<Array<{ id: number, x: number, y: number }>>([])

  useEffect(() => {
    // Create 15 floating elements
    const newElements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    }))
    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          initial={{ x: element.x, y: element.y, opacity: 0 }}
          animate={{
            x: [element.x, element.x + 100, element.x - 100, element.x],
            y: [element.y, element.y - 200],
            opacity: [0, 1, 1, 0],
            rotate: [0, 45, -45, 0]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className={`
            w-3 h-3 rounded-full
            ${Math.random() > 0.5 ? 'bg-primary/10' : 'bg-white/10'}
            backdrop-blur-sm
          `} />
        </motion.div>
      ))}
      
      {/* Floating leaves */}
      {elements.map((element) => (
        <motion.div
          key={`leaf-${element.id}`}
          className="absolute"
          initial={{ x: element.x, y: window.innerHeight + 100 }}
          animate={{
            x: [element.x, element.x + 200, element.x - 200, element.x + 100],
            y: [window.innerHeight + 100, -100],
            rotate: [0, 360]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        >
          <svg 
            className="w-4 h-4 text-primary/20" 
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L8 6H16L12 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

export default FloatingElements 