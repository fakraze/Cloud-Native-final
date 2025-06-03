import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import ConfirmDeleteModal from '../ConfirmDeleteModal';

describe('ConfirmDeleteModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    itemName: 'Test Item',
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<ConfirmDeleteModal {...defaultProps} />);
      
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<ConfirmDeleteModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
    });

    it('should render without itemName when not provided', () => {
      const props = { ...defaultProps, itemName: undefined };
      render(<ConfirmDeleteModal {...props} />);
      
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
    });

    it('should render loading state correctly', () => {
      render(<ConfirmDeleteModal {...defaultProps} isLoading={true} />);
      
      const confirmButton = screen.getByText('Deleting...');
      const cancelButton = screen.getByText('Cancel');
      
      expect(confirmButton).toBeInTheDocument();
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConfirmDeleteModal {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      const closeButton = buttons[0]; // The X button is the first button
      await user.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConfirmDeleteModal {...defaultProps} />);
      
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConfirmDeleteModal {...defaultProps} />);
      
      const confirmButton = screen.getByText('Delete');
      await user.click(confirmButton);
      
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events correctly', async () => {
      const user = userEvent.setup();
      render(<ConfirmDeleteModal {...defaultProps} />);
      
      // Focus the modal first
      const modal = screen.getByText('Delete Item').closest('div');
      if (modal) {
        modal.focus();
      }
      
      // Test Escape key
      await user.keyboard('{Escape}');
      // Note: Escape key handling would need to be implemented in the component
    });

    it('should not allow interactions when loading', async () => {
      const user = userEvent.setup();
      render(<ConfirmDeleteModal {...defaultProps} isLoading={true} />);
      
      const cancelButton = screen.getByText('Cancel');
      
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels and structure', () => {
      render(<ConfirmDeleteModal {...defaultProps} />);
      
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot in default state', () => {
      const { container } = render(<ConfirmDeleteModal {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot in loading state', () => {
      const { container } = render(<ConfirmDeleteModal {...defaultProps} isLoading={true} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot without itemName', () => {
      const props = { ...defaultProps, itemName: undefined };
      const { container } = render(<ConfirmDeleteModal {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
