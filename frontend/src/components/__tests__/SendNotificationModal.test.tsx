import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { SendNotificationModal } from '../SendNotificationModal';

// Mock the hooks
vi.mock('../../hooks/useInbox', () => ({
  useSendNotification: () => ({
    sendToAllEmployees: vi.fn(),
    isLoading: false,
    error: null,
  })
}));

describe('SendNotificationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  const mockSendToAllEmployees = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(require('../../hooks/useInbox').useSendNotification).mockReturnValue({
      sendToAllEmployees: mockSendToAllEmployees,
      isLoading: false,
      error: null,
    });
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<SendNotificationModal {...defaultProps} />);
      
      expect(screen.getByText('Send Notification')).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<SendNotificationModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Send Notification')).not.toBeInTheDocument();
    });

    it('should render all message type options', () => {
      render(<SendNotificationModal {...defaultProps} />);
      
      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should render loading state', () => {
      vi.mocked(require('../../hooks/useInbox').useSendNotification).mockReturnValue({
        sendToAllEmployees: mockSendToAllEmployees,
        isLoading: true,
        error: null,
      });

      render(<SendNotificationModal {...defaultProps} />);
      
      const sendButton = screen.getByRole('button', { name: /send notification/i });
      expect(sendButton).toBeDisabled();
      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });

    it('should render error state', () => {
      vi.mocked(require('../../hooks/useInbox').useSendNotification).mockReturnValue({
        sendToAllEmployees: mockSendToAllEmployees,
        isLoading: false,
        error: 'Failed to send notification',
      });

      render(<SendNotificationModal {...defaultProps} />);
      
      expect(screen.getByText('Failed to send notification')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should handle title input changes', async () => {
      const user = userEvent.setup();
      render(<SendNotificationModal {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test Notification');
      
      expect(titleInput).toHaveValue('Test Notification');
    });

    it('should handle message input changes', async () => {
      const user = userEvent.setup();
      render(<SendNotificationModal {...defaultProps} />);
      
      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, 'This is a test notification message');
      
      expect(messageInput).toHaveValue('This is a test notification message');
    });

    it('should handle message type selection', async () => {
      const user = userEvent.setup();
      render(<SendNotificationModal {...defaultProps} />);
      
      const warningOption = screen.getByLabelText('Warning');
      await user.click(warningOption);
      
      expect(warningOption).toBeChecked();
    });
  });

  describe('Form Validation', () => {
    it('should not submit when title is empty', async () => {
      const user = userEvent.setup();
      render(<SendNotificationModal {...defaultProps} />);
      
      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, 'Test message');
      
      const sendButton = screen.getByRole('button', { name: /send notification/i });
      await user.click(sendButton);
      
      expect(mockSendToAllEmployees).not.toHaveBeenCalled();
    });

    it('should not submit when message is empty', async () => {
      const user = userEvent.setup();
      render(<SendNotificationModal {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test Title');
      
      const sendButton = screen.getByRole('button', { name: /send notification/i });
      await user.click(sendButton);
      
      expect(mockSendToAllEmployees).not.toHaveBeenCalled();
    });

    it('should not submit when both title and message are empty', async () => {
      const user = userEvent.setup();
      render(<SendNotificationModal {...defaultProps} />);
      
      const sendButton = screen.getByRole('button', { name: /send notification/i });
      await user.click(sendButton);
      
      expect(mockSendToAllEmployees).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should submit valid form data', async () => {
      const user = userEvent.setup();
      mockSendToAllEmployees.mockResolvedValue(undefined);
      
      render(<SendNotificationModal {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const messageInput = screen.getByLabelText(/message/i);
      const warningOption = screen.getByLabelText('Warning');
      
      await user.type(titleInput, 'Important Update');
      await user.type(messageInput, 'Please review the new policies');
      await user.click(warningOption);
      
      const sendButton = screen.getByRole('button', { name: /send notification/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(mockSendToAllEmployees).toHaveBeenCalledWith(
          'Important Update',
          'Please review the new policies',
          'warning'
        );
      });
    });

    it('should call onSuccess after successful submission', async () => {
      const user = userEvent.setup();
      mockSendToAllEmployees.mockResolvedValue(undefined);
      
      render(<SendNotificationModal {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      await user.type(titleInput, 'Test Title');
      await user.type(messageInput, 'Test Message');
      
      const sendButton = screen.getByRole('button', { name: /send notification/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      mockSendToAllEmployees.mockResolvedValue(undefined);
      
      render(<SendNotificationModal {...defaultProps} />);
      
      const titleInput = screen.getByLabelText(/title/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      await user.type(titleInput, 'Test Title');
      await user.type(messageInput, 'Test Message');
      
      const sendButton = screen.getByRole('button', { name: /send notification/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(titleInput).toHaveValue('');
        expect(messageInput).toHaveValue('');
      });
    });
  });

  describe('Modal Controls', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<SendNotificationModal {...defaultProps} />);
      
      const closeButton = screen.getByLabelText(/close/i);
      await user.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<SendNotificationModal {...defaultProps} />);
      
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<SendNotificationModal {...defaultProps} />);
      
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    });

    it('should have proper radio button labels', () => {
      render(<SendNotificationModal {...defaultProps} />);
      
      expect(screen.getByLabelText('Information')).toBeInTheDocument();
      expect(screen.getByLabelText('Success')).toBeInTheDocument();
      expect(screen.getByLabelText('Warning')).toBeInTheDocument();
      expect(screen.getByLabelText('Error')).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot in default state', () => {
      const { container } = render(<SendNotificationModal {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot in loading state', () => {
      vi.mocked(require('../../hooks/useInbox').useSendNotification).mockReturnValue({
        sendToAllEmployees: mockSendToAllEmployees,
        isLoading: true,
        error: null,
      });

      const { container } = render(<SendNotificationModal {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with error', () => {
      vi.mocked(require('../../hooks/useInbox').useSendNotification).mockReturnValue({
        sendToAllEmployees: mockSendToAllEmployees,
        isLoading: false,
        error: 'Test error message',
      });

      const { container } = render(<SendNotificationModal {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
