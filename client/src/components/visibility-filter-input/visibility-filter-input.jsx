import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { setFilter } from '../../actions/actions';

function VisibilityFilterInput(props) {
  return (
    <Container>
      <Row>
        <Col>
          <Form.Control
            onChange={(e) => props.setFilter(e.target.value)}
            value={props.visibilityFilter}
            placeholder="Search Movie Title"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default connect(null, { setFilter })(VisibilityFilterInput);

VisibilityFilterInput.propTypes = {
  visibilityFilter: PropTypes.string.isRequired,
};
