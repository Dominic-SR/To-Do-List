import React from 'react'
import { Navbar,
    Container,
  } from "react-bootstrap";
  
const Header = () => {
  return (
    <Navbar className="bg-body-tertiary mw-100">
    <Container>
        <Navbar.Brand href="#home">To Do List</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header