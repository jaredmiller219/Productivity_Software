import React, { useState, useRef, useCallback } from "react";
import "./StickyNote.css";

function StickyNote({ note, updateNote, deleteNote }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const noteRef = useRef(null);

  const handleMouseDown = (e) => {
    if (
      e.target.className === "note-content" ||
      e.target.className === "note-header"
    ) {
      setIsDragging(true);
      const rect = noteRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      updateNote(note.id, { position: newPosition });
    }
  }, [isDragging, dragOffset.x, dragOffset.y, note.id, updateNote]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTextChange = (e) => {
    updateNote(note.id, { text: e.target.value });
  };

  // Add event listeners to the window for mouse move and up
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={noteRef}
      className="sticky-note"
      style={{
        backgroundColor: note.color,
        left: `${note.position.x}px`,
        top: `${note.position.y}px`,
        zIndex: isDragging ? 100 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="note-header">
        <div className="drag-handle"></div>
        <button className="delete-btn" onClick={() => deleteNote(note.id)}>
          ×
        </button>
      </div>
      <textarea
        className="note-content"
        value={note.text}
        onChange={handleTextChange}
        placeholder="Write your note here..."
      />
    </div>
  );
}

export default StickyNote;
