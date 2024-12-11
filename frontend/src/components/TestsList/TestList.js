import React, { useState, useEffect } from 'react';
import { environment } from '../../env/environment';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './TestList.css';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      const courseId = localStorage.courseId;
      const response = await fetch(environment.apiHost + 'tests/list' + "/" + courseId);
      if (!response.ok) {
        throw new Error('Greška prilikom dobijanja testova');
      }
      const data = await response.json();
      setTests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []); 

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (error) {
    return <div>Greška: {error}</div>;
  }

  const handleEditClick = (testId) => {
    navigate(`/test-form/${testId}`);
  };

  const handlePublishClick = (e, test) => {
    e.preventDefault();
    setSelectedTest(test);
    setActionType('publish');
    window.$('#confirmationModal').modal('show');
  };

  const handleResultsClick = (e, test) => {
    e.preventDefault();
    navigate(`/test-result-details-teacher/` + test.id)
  };

  const handleDeleteClick = (e, test) => {
    e.preventDefault();
    setSelectedTest(test);
    setActionType('delete');
    window.$('#confirmationModal').modal('show');
  };

  const confirmAction = async () => {
    try {
      if (!selectedTest) return;

      const url = actionType === 'publish'
        ? `${environment.apiHost}tests/publish`
        : `${environment.apiHost}tests/delete`;

      const method = 'PUT';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTest),
      });

      if (!response.ok) {
        window.$('#confirmationModal').modal('hide');
        throw new Error(actionType === 'publish' ? 'Greška prilikom objavljivanja testa' : 'Greška prilikom brisanja testa');
      }

      fetchTests(); 
      toast.success(actionType === 'publish' ? 'Test je uspješno objavljen' : 'Test je uspješno obrisan');

      window.$('#confirmationModal').modal('hide');
    } catch (error) {
      window.$('#confirmationModal').modal('hide');
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Testovi</h2>
      <div className="row">
        {tests.map((test) => {
          const fontColor = test.isPublished ? 'text-success' : 'text-dark';
          const publishVisibility = test.isPublished ? 'd-none' : 'd-block';

          return (
            <div key={test.id} className="col-12 mb-4">
              <div className="card shadow-sm rounded card-hover">
                <div className="card-body d-flex flex-column">
                  <Link to={`/test-form/${test.id}`} className={`card-title ${fontColor} link-hover`}>
                    <h5>{test.name}</h5>
                  </Link>
                  <p className="card-text">{test.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="card-text"><small className="text-muted">Teacher email: {test.teacherUsername}</small></p>
                    <div className="test-actions">
                      <button className={`btn btn-outline-success ${publishVisibility}`} onClick={(e) => handlePublishClick(e, test)}>Objavi</button>
                      <button className={`btn btn-outline-success ${!publishVisibility}`} onClick={(e) => handleResultsClick(e, test)}>Vidi rezultate</button>
                      <button className={`btn btn-outline-primary ${publishVisibility}`} onClick={() => handleEditClick(test.id)}>Uredi</button>
                      <button className="btn btn-outline-danger" onClick={(e) => handleDeleteClick(e, test)}>Obriši</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bootstrap modal za potvrdu */}
      <div className="modal fade" id="confirmationModal" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmationModalLabel">
                {actionType === 'publish' ? 'Potvrdi objavu testa' : 'Potvrdi brisanje testa'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Da li ste sigurni da želite da {actionType === 'publish' ? 'objavite' : 'obrišete'} test "{selectedTest?.name}"?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Otkaži</button>
              <button type="button" className="btn btn-success" onClick={confirmAction}>Potvrdi</button>
            </div>
          </div>
        </div>
      </div>

      {/* React-Toastify kontejner */}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TestList;
