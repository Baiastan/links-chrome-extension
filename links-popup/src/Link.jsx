import React, { useState } from 'react';
import { PiCopySimpleLight } from 'react-icons/pi';
import { HiCheckCircle } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const Link = ({
  label,
  value,
  id,
  onLinkChange,
  onCopy,
  copied,
  isEditable,
  onLinkEditChange,
  editAll,
  onLabelChange,
  index,
  onDeleteLink,
}) => {
  return isEditable || editAll ? (
    <div className="link">
      <input
        type="text"
        value={label}
        maxLength={20}
        className="input-label"
        autoFocus={index === 0}
        placeholder="Label"
        onChange={(e) => onLabelChange(id, e.target.value)}
      />

      <span
        className="icon delete-icon"
        role="button"
        aria-label={`delete the link`}
        onClick={() => onDeleteLink(id)}
      >
        <RiDeleteBin6Line />
      </span>
      <input
        type="text"
        id={id}
        placeholder="New Link"
        name={id}
        value={value}
        onChange={(e) => onLinkChange(id, e.target.value)}
      />
      {isEditable && <button onClick={() => onLinkEditChange(id)}>done</button>}
    </div>
  ) : (
    <div className="link link-copy" onClick={() => onCopy(id, value)}>
      <label htmlFor={id}>{label}</label>
      <span
        className="icon copy-icon"
        role="button"
        aria-label={`copy the link`}
      >
        {copied ? (
          <>
            copied <HiCheckCircle />
          </>
        ) : (
          <PiCopySimpleLight data-copy="copy-icon" />
        )}
      </span>

      <p className="link-text">
        <a href={value} target="_blank">
          {value}
        </a>
      </p>
    </div>
  );
};

export default Link;
