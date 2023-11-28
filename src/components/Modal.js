
import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ post, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClickOutside = (event) => {
    onClose();
    if (event.target.className === 'modal-overlay') {
      closeModal();
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    onClose();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="modal">
        <span className="close-btn" onClick={closeModal}>&times;</span>
        <h2>Post Content</h2>
        <p>{post.body}</p>
      </div>
    </div>
  );
};

export default Modal;
