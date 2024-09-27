import React, { useState, useEffect, useRef } from 'react';
import shortUUID from 'short-uuid';
import { FiEdit2 } from 'react-icons/fi';
import { FaCheck } from 'react-icons/fa';
import Link from './Link';

const App = () => {
  const [links, setLinks] = useState([
    { id: '', link: '', label: '', isEditable: true },
  ]);
  const [copiedLink, setCopiedLink] = useState(null);
  const [edit, setEdit] = useState(false);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    chrome.storage.sync.get(['links'], (result) => {
      if (result.links) {
        setLinks(result.links);
      }
    });
  }, []);

  const updateLinks = (newLinks) => {
    setLinks(newLinks);
    chrome.storage.sync.set({ links: newLinks });
  };

  const handleLinkChange = (id, value) => {
    updateLinks(
      links.map((link) => (link.id === id ? { ...link, value } : link))
    );
  };

  const handleLabelChange = (id, label) => {
    updateLinks(
      links.map((link) => (link.id === id ? { ...link, label } : link))
    );
  };

  const handleCopy = (id, value) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedLink(id);
        timeoutIdRef.current = setTimeout(() => {
          setCopiedLink(null);
          timeoutIdRef.current = null;
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const addLink = () => {
    const id = shortUUID.generate();
    const newLink = { id, label: '', value: '', isEditable: true };
    updateLinks([newLink, ...links]);
  };

  const handleEditLinkChange = (id) => {
    updateLinks(
      links.map((link) => {
        if (link?.value === '' || link?.label === '') {
          return link.id === id
            ? {
                ...link,
                label: 'Linkedin',
                value: 'https://www.linkedin.com/in/baiastan-zhuzupbekov/',
                isEditable: false,
              }
            : link;
        }

        return link.id === id ? { ...link, isEditable: false } : link;
      })
    );
  };

  const deleteLink = (id) => {
    const newLinks = links.filter((link) => link.id !== id);
    updateLinks(newLinks);
    if (newLinks.length === 0) setEdit(false);
  };

  const handleEditDone = () => {
    setEdit((prev) => {
      if (!prev) return true;

      if (prev) {
        setLinks((prevLinks) => {
          const newLinks = prevLinks.filter(
            (link) => link.value !== '' || link.label !== ''
          );
          return newLinks;
        });
        return false;
      }
    });
  };

  return (
    <>
      <header>
        <button
          className="add-link-button"
          aria-label="click to add a new link"
          tabIndex="0"
          onClick={addLink}
        >
          Add Links +
        </button>
        {links.length > 0 && (
          <span className="icon edit-icon" onClick={handleEditDone}>
            {edit ? <FaCheck data-done="save" /> : <FiEdit2 data-edit="edit" />}
          </span>
        )}
      </header>

      {links.map((link, index) => (
        <Link
          key={link.id}
          {...link}
          index={index}
          editAll={edit}
          copied={copiedLink === link.id}
          onCopy={handleCopy}
          onLinkChange={handleLinkChange}
          onLabelChange={handleLabelChange}
          onDeleteLink={deleteLink}
          onLinkEditChange={handleEditLinkChange}
        />
      ))}
    </>
  );
};

export default App;
