import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the footer heading', () => {
    render(<Footer />)

    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
