"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function Modal({ isOpen, onClose, children }) {
  return (
<<<<<<< HEAD
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass border border-white/20 dark:border-gray-800/50 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
=======
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
>>>>>>> b4a789009a7ac86e055a2f5c3cefe2f1941c7ed8
  )
}

