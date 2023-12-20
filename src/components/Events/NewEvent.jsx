import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"; // import useMutation
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { createNewEvent } from "../../util/http.js";

export default function NewEvent() {
  const navigate = useNavigate();

  // we do not need wrap it the mutationFn with an anonymous function to pass the formData through to createNewEvent
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
  });

  function handleSubmit(formData) {
    // we can call the mutate function and pass it the formData ( { event: x } is just the shape the backend expects)
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title={"Failed to create event"}
          message={
            error.info?.message ||
            "Failed to create event. Please check your inputs and try again"
          }
        />
      )}
    </Modal>
  );
}
