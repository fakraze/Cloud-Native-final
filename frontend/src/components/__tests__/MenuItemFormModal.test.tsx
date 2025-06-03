import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import MenuItemFormModal from '../MenuItemFormModal';
import { MenuItem } from '../../types/restaurant';

// Mock MenuItem data
const mockMenuItem: MenuItem = {
  id: '1',
  restaurantId: 'rest-1',
  name: 'Test Pizza',
  description: 'Delicious test pizza',
  price: 15.99,
  imageUrl: 'test-image.jpg',
  category: 'pizza',
  isAvailable: true,
  preparationTime: 20,
  allergens: ['gluten', 'dairy'],
  nutritionInfo: {
    calories: 500,
    protein: 20,
    carbs: 40,
    fat: 15
  },
  customizations: []
};

describe('MenuItemFormModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<MenuItemFormModal {...defaultProps} />);
      
      expect(screen.getByText('Add Menu Item')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<MenuItemFormModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Add Menu Item')).not.toBeInTheDocument();
    });

    it('should render edit mode when menuItem is provided', () => {
      render(<MenuItemFormModal {...defaultProps} menuItem={mockMenuItem} />);
      
      expect(screen.getByText('Edit Menu Item')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Pizza')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Delicious test pizza')).toBeInTheDocument();
      expect(screen.getByDisplayValue('15.99')).toBeInTheDocument();
    });

    it('should render loading state correctly', () => {
      render(<MenuItemFormModal {...defaultProps} isLoading={true} />);
      
      const submitButton = screen.getByRole('button', { name: /add menu item/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add menu item/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      });
    });

    it('should validate price is positive', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const priceInput = screen.getByLabelText(/price/i);
      await user.clear(priceInput);
      await user.type(priceInput, '-5');
      
      const submitButton = screen.getByRole('button', { name: /add menu item/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument();
      });
    });

    it('should validate preparation time is positive', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const prepTimeInput = screen.getByLabelText(/preparation time/i);
      await user.clear(prepTimeInput);
      await user.type(prepTimeInput, '0');
      
      const submitButton = screen.getByRole('button', { name: /add menu item/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/preparation time must be at least 1 minute/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Interactions', () => {
    it('should handle text input changes', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      
      await user.type(nameInput, 'New Pizza');
      await user.type(descriptionInput, 'A delicious new pizza');
      
      expect(nameInput).toHaveValue('New Pizza');
      expect(descriptionInput).toHaveValue('A delicious new pizza');
    });

    it('should handle category selection', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const categorySelect = screen.getByLabelText(/category/i);
      await user.selectOptions(categorySelect, 'pizza');
      
      expect(categorySelect).toHaveValue('pizza');
    });

    it('should handle allergen selection', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const glutenCheckbox = screen.getByLabelText(/gluten/i);
      await user.click(glutenCheckbox);
      
      expect(glutenCheckbox).toBeChecked();
    });

    it('should handle availability toggle', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const availabilityCheckbox = screen.getByLabelText(/available/i);
      await user.click(availabilityCheckbox);
      
      expect(availabilityCheckbox).not.toBeChecked();
    });
  });

  describe('Form Submission', () => {
    it('should submit valid form data', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      // Fill out required fields
      await user.type(screen.getByLabelText(/name/i), 'Test Item');
      await user.type(screen.getByLabelText(/description/i), 'Test description');
      await user.type(screen.getByLabelText(/price/i), '10.99');
      await user.selectOptions(screen.getByLabelText(/category/i), 'pizza');
      
      const submitButton = screen.getByRole('button', { name: /add menu item/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Item',
            description: 'Test description',
            price: 10.99,
            category: 'pizza',
          })
        );
      });
    });

    it('should submit edited menu item data', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} menuItem={mockMenuItem} />);
      
      const nameInput = screen.getByDisplayValue('Test Pizza');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Pizza');
      
      const submitButton = screen.getByRole('button', { name: /update menu item/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Updated Pizza',
          })
        );
      });
    });
  });

  describe('Modal Controls', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const closeButton = screen.getByLabelText(/close/i);
      await user.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Nutrition Information', () => {
    it('should handle nutrition info inputs', async () => {
      const user = userEvent.setup();
      render(<MenuItemFormModal {...defaultProps} />);
      
      const caloriesInput = screen.getByLabelText(/calories/i);
      const proteinInput = screen.getByLabelText(/protein/i);
      
      await user.type(caloriesInput, '250');
      await user.type(proteinInput, '15');
      
      expect(caloriesInput).toHaveValue(250);
      expect(proteinInput).toHaveValue(15);
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot for add mode', () => {
      const { container } = render(<MenuItemFormModal {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot for edit mode', () => {
      const { container } = render(<MenuItemFormModal {...defaultProps} menuItem={mockMenuItem} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot in loading state', () => {
      const { container } = render(<MenuItemFormModal {...defaultProps} isLoading={true} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
