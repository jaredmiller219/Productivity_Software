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
  'mkdir': 'Create directories',
  'rm': 'Remove files and directories',
  'cp': 'Copy files and directories',
  'mv': 'Move/rename files and directories',
  'cat': 'Display file contents',
  'grep': 'Search text patterns',
  'find': 'Search for files and directories',
  'ps': 'Display running processes',
  'kill': 'Terminate processes',
  'top': 'Display and update sorted information about running processes',
  'ping': 'Send ICMP echo requests to network hosts',
  'ssh': 'Secure Shell remote login',
  'git': 'Version control system',
  'npm': 'Node.js package manager',
  'docker': 'Container platform',
  'vim': 'Vi IMproved text editor',
  'sudo': 'Execute commands as another user',
  'chmod': 'Change file permissions',
  'chown': 'Change file ownership',
  'tar': 'Archive files',
  'wget': 'Download files from web',
  'curl': 'Transfer data from/to servers',
  'echo': 'Display text',
  'history': 'Show command history'
};

const COMMON_OPTIONS = {
  'ls': ['-l', '-a', '-h', '-t', '-r', '-S', '-R', '--color'],
  'rm': ['-r', '-f', '-i', '-v'],
  'cp': ['-r', '-i', '-v', '-p', '-u'],
  'mv': ['-i', '-v', '-u'],
  'grep': ['-i', '-r', '-n', '-v', '-c', '-l', '-w', '-x'],
  'find': ['-name', '-type', '-size', '-mtime', '-exec', '-delete'],
  'ps': ['-aux', '-ef', '-u', '-p'],
  'git': ['add', 'commit', 'push', 'pull', 'clone', 'status', 'log', 'diff', 'branch', 'checkout', 'merge'],
  'npm': ['install', 'uninstall', 'update', 'start', 'test', 'run', 'init', 'publish'],
  'docker': ['run', 'build', 'pull', 'push', 'ps', 'images', 'exec', 'logs', 'stop', 'rm'],
  'ssh': ['-p', '-i', '-L', '-R', '-D', '-X', '-Y'],
  'tar': ['-czf', '-xzf', '-tzf', '-cjf', '-xjf', '-tjf'],
  'chmod': ['+x', '+r', '+w', '755', '644', '600', '777']
};

function TerminalAutocomplete({ 
  input, 
  position, 
  onSelect, 
  onClose, 
  commandHistory = [],
  isVisible = false 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !input.trim()) {
      setSuggestions([]);
      return;
    }

    const words = input.trim().split(/\s+/);
    const currentWord = words[words.length - 1];
    const isFirstWord = words.length === 1;

    let newSuggestions;

    if (isFirstWord) {
      // Suggest commands
      const commandSuggestions = COMMON_COMMANDS
        .filter(cmd => cmd.toLowerCase().startsWith(currentWord.toLowerCase()))
        .map(cmd => ({
          text: cmd,
          type: 'command',
          description: COMMAND_DESCRIPTIONS[cmd] || 'Command'
        }));

      // Add history suggestions
      const historySuggestions = commandHistory
        .filter(historyItem => 
          historyItem.toLowerCase().startsWith(currentWord.toLowerCase()) &&
          !COMMON_COMMANDS.includes(historyItem.split(' ')[0])
        )
        .slice(0, 5)
        .map(historyItem => ({
          text: historyItem,
          type: 'history',
          description: 'From history'
        }));

      newSuggestions = [...commandSuggestions, ...historySuggestions];
    } else {
      // Suggest options for the current command
      const command = words[0];
      const options = COMMON_OPTIONS[command] || [];
      
      const optionSuggestions = options
        .filter(option => option.toLowerCase().startsWith(currentWord.toLowerCase()))
        .map(option => ({
          text: option,
          type: 'option',
          description: `Option for ${command}`
        }));

      // Suggest file paths (simplified)
      const pathSuggestions = [];
      if (currentWord.includes('/') || currentWord.includes('\\')) {
        // This would typically involve filesystem access
        // For now we'll add some common paths
        const commonPaths = ['/', '/home', '/usr', '/var', '/etc', '/tmp', './'];
        pathSuggestions.push(...commonPaths
          .filter(path => path.toLowerCase().startsWith(currentWord.toLowerCase()))
          .map(path => ({
            text: path,
            type: 'path',
            description: 'File path'
          }))
        );
      }

      newSuggestions = [...optionSuggestions, ...pathSuggestions];
    }

    setSuggestions(newSuggestions.slice(0, 10)); // Limit to 10 suggestions
    setSelectedIndex(0);
  }, [input, isVisible, commandHistory]);

  useEffect(() => {
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
            handleSelectSuggestion(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onClose]);

  const handleSelectSuggestion = (suggestion) => {
    const words = input.trim().split(/\s+/);
    const newWords = [...words.slice(0, -1), suggestion.text];
    const newInput = newWords.join(' ') + ' ';
    onSelect(newInput);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'command': return '⚡';
      case 'option': return '🔧';
      case 'path': return '📁';
      case 'history': return '🕒';
      default: return '💡';
    }
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      className="terminal-autocomplete"
      ref={autocompleteRef}
      style={{
        left: position?.x || 0,
        top: position?.y || 0
      }}
    >
      <div className="autocomplete-header">
        <span className="autocomplete-title">Suggestions</span>
        <span className="autocomplete-hint">Tab to complete</span>
      </div>
      <div className="autocomplete-list">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.type}-${suggestion.text}-${index}`}
            className={`autocomplete-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => handleSelectSuggestion(suggestion)}
          >
            <span className="suggestion-icon">
              {getSuggestionIcon(suggestion.type)}
            </span>
            <div className="suggestion-content">
              <div className="suggestion-text">{suggestion.text}</div>
              <div className="suggestion-description">{suggestion.description}</div>
            </div>
            <span className="suggestion-type">{suggestion.type}</span>
          </div>
        ))}
      </div>
      <div className="autocomplete-footer">
        <span>↑↓ Navigate • Tab/Enter Select • Esc Close</span>
      </div>
    </div>
  );
}

export default TerminalAutocomplete;
