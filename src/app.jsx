import { useState, useEffect, useRef } from "react";
import { Container, Row, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./app.css";
import LoadingSpinner from "./LoadingSpinner";

export function App() {
  const [apiInfo, setApiInfo] = useState(null);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (!dataFetchedRef.current) {
      fetch("/api/v1/screener")
        .then((data) => data.json())
        .then((data) => setApiInfo(data));
        dataFetchedRef.current = true;
    }
  }, []);

  return (
    <div className="App">
      {!apiInfo && <LoadingSpinner />}
      <Container fluid style={{ backgroundColor: '#166534' }}>
        {apiInfo && (
          <>
            {apiInfo.map((item) => (
              <>
                <Row id={item.name}  style={{ justifyContent: 'center', padding: '0.3rem' }}>
                  <Card style={{width: '95vw', backgroundColor: '#86efac' }}>
                    <Card.Body>
                      <Card.Title style={{ color: '#374151' }}>{item.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {item.buyPrice}
                      </Card.Subtitle>
                      <Card.Text>
                        Sold: {item.soldPrice}
                        <br />
                        Cut: {item.cutOff}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Row>
              </>
            ))}
          </>
        )}
      </Container>
    </div>
  );
}
