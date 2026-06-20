import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginPage } from '../pages/AuthPages';
import { BrowserRouter } from 'react-router-dom';

// Mock the Auth hook and analytics to avoid real network requests
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    signup: vi.fn(),
  })
}));
vi.mock('../lib/analytics', () => ({
  trackLoginSuccess: vi.fn(),
  trackRoleSelected: vi.fn(),
  trackSignupClick: vi.fn(),
}));

vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: () => <div data-testid="turnstile-mock" />
}));

describe('Role Selector in LoginPage', () => {
  it('renders student, instructor, and admin roles', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    expect(screen.getAllByText('Student').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Instructor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });

  it('allows clicking different roles', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const instructorButton = screen.getByRole('radio', { name: /instructor/i });
    fireEvent.click(instructorButton);
    expect(instructorButton).toHaveAttribute('aria-checked', 'true');
  });
});
