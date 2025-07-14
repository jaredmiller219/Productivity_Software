import React, { useState, useEffect, useRef } from 'react';
import './TerminalAutocomplete.css';

const COMMON_COMMANDS = [
  // File operations
  'ls', 'dir', 'cd', 'pwd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 'find', 'locate',
  'touch', 'chmod', 'chown', 'ln', 'stat', 'file', 'du', 'df', 'tree',
  
  // Text processing
  'cat', 'less', 'more', 'head', 'tail', 'grep', 'sed', 'awk', 'sort', 'uniq',
  'cut', 'tr', 'wc', 'diff', 'comm', 'join', 'paste', 'column', 'fold', 'fmt',
  
  // Process management
  'ps', 'top', 'htop', 'kill', 'killall', 'jobs', 'bg', 'fg', 'nohup', 'screen',
  'tmux', 'pgrep', 'pkill', 'pidof', 'lsof', 'fuser', 'uptime', 'who', 'w',
  
  // Network
  'ping', 'wget', 'curl', 'ssh', 'scp', 'rsync', 'netstat', 'ss', 'lsof',
  'iptables', 'ufw', 'nmap', 'telnet', 'ftp', 'sftp', 'nc', 'socat',
  
  // System info
  'uname', 'hostname', 'whoami', 'id', 'groups', 'date', 'cal', 'uptime',
  'free', 'vmstat', 'iostat', 'lscpu', 'lsblk', 'lsusb', 'lspci', 'dmesg',
  
  // Archive/compression
  'tar', 'gzip', 'gunzip', 'zip', 'unzip', 'rar', 'unrar', '7z', 'compress',
  'uncompress', 'zcat', 'zless', 'zgrep', 'bzip2', 'bunzip2',
  
  // Development
  'git', 'npm', 'node', 'python', 'python3', 'pip', 'pip3', 'java', 'javac',
  'gcc', 'g++', 'make', 'cmake', 'docker', 'kubectl', 'helm', 'terraform',
  
  // Text editors
  'vim', 'vi', 'nano', 'emacs', 'code', 'subl', 'atom', 'gedit', 'kate',
  
  // Package management
  'apt', 'apt-get', 'yum', 'dnf', 'pacman', 'brew', 'snap', 'flatpak',
  'zypper', 'emerge', 'portage', 'pkg', 'pkgng',
  
  // System control
  'sudo', 'su', 'systemctl', 'service', 'chkconfig', 'crontab', 'at', 'batch',
  'mount', 'umount', 'fdisk', 'parted', 'mkfs', 'fsck', 'blkid', 'lsblk',
  
  // Utilities
  'echo', 'printf', 'read', 'test', 'expr', 'bc', 'dc', 'seq', 'yes', 'true',
  'false', 'sleep', 'timeout', 'watch', 'xargs', 'parallel', 'tee', 'script'
];

const COMMAND_DESCRIPTIONS = {
  'ls': 'List directory contents',
  'cd': 'Change directory',
  'pwd': 'Print working directory',
  'mkdir': 'Create directory',
  'rm': 'Remove files/directories',
  'cp': 'Copy files/directories',
  'mv': 'Move/rename files',
  'cat': 'Display file contents',
  'grep': 'Search text patterns',
  'find': 'Search for files',
  'ps': 'Show running processes',
  'kill': 'Terminate processes',
  'top': 'Display running processes',
  'ping': 'Test network connectivity',
  'ssh': 'Secure shell connection',
  'git': 'Version control system',
  'npm': 'Node package manager',
  'sudo': 'Execute as another user',
  'chmod': 'Change file permissions',
  'tar': 'Archive files',
  'wget': 'Download files',
  'curl': 'Transfer data',
  'vim': 'Text editor',
  'nano': 'Simple text editor'
};

const TerminalAutocomplete = ({ 
  input, 
  onSelect, 
  isVisible, 
  position,
  commandHistory = []
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!input.trim() || !isVisible) {
      setSuggestions([]);
      return;
    }

    const words = input.trim().split(' ');
    const currentWord = words[words.length - 1];
    
    if (!currentWord) {
      setSuggestions([]);
      return;
    }

    // Get suggestions from command history first
    const historySuggestions = commandHistory
      .filter(cmd => cmd.toLowerCase().startsWith(currentWord.toLowerCase()))
      .slice(0, 3)
      .map(cmd => ({
        text: cmd,
        type: 'history',
        description: 'From history'
      }));

    // Get command suggestions
    const commandSuggestions = COMMON_COMMANDS
      .filter(cmd => cmd.toLowerCase().startsWith(currentWord.toLowerCase()))
      .slice(0, 8)
      .map(cmd => ({
        text: cmd,
        type: 'command',
        description: COMMAND_DESCRIPTIONS[cmd] || 'Command'
      }));

    // Combine and deduplicate
    const allSuggestions = [...historySuggestions, ...commandSuggestions];
    const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) =>
      index === self.findIndex(s => s.text === suggestion.text)
    );

    setSuggestions(uniqueSuggestions.slice(0, 10));
    setSelectedIndex(0);
  }, [input, isVisible, commandHistory]);

  const handleSelect = (suggestion) => {
    const words = input.trim().split(' ');
    words[words.length - 1] = suggestion.text;
    const newInput = words.join(' ') + ' ';
    onSelect(newInput);
  };

  const handleKeyDown = (e) => {
    if (!isVisible || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Tab':
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSuggestions([]);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      ref={autocompleteRef}
      className="terminal-autocomplete"
      style={{
        left: position?.x || 0,
        top: position?.y || 0
      }}
    >
      <div className="autocomplete-header">
        <span className="autocomplete-title">Suggestions</span>
        <span className="autocomplete-hint">Tab/Enter to select, Esc to close</span>
      </div>
      
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.text}-${index}`}
            className={`suggestion-item ${index === selectedIndex ? 'selected' : ''} ${suggestion.type}`}
            onClick={() => handleSelect(suggestion)}
          >
            <div className="suggestion-main">
              <span className="suggestion-text">{suggestion.text}</span>
              <span className={`suggestion-type ${suggestion.type}`}>
                {suggestion.type === 'history' ? '🕒' : '⚡'}
              </span>
            </div>
            <div className="suggestion-description">
              {suggestion.description}
            </div>
          </div>
        ))}
      </div>
      
      <div className="autocomplete-footer">
        <span className="navigation-hint">
          ↑↓ Navigate • Tab/Enter Select • Esc Close
        </span>
      </div>
    </div>
  );
};

export default TerminalAutocomplete;
