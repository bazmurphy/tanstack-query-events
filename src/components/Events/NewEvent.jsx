import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"; // import useMutation
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { createNewEvent } from "../../util/http.js";
import { queryClient } from "../../util/http.js";

export default function NewEvent() {
  const navigate = useNavigate();

  // we do not need wrap it the mutationFn with an anonymous function to pass the formData through to createNewEvent
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    // we add a new property onSuccess which runs a function once the mutation has succeeded
    onSuccess: () => {
      // we use the imported queryClient and then call invalidateQueries
      // to invalidate the data and therefore it is re-fetched
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // we can navigate after successful mutation
      navigate("/events");
    },
  });

  function handleSubmit(formData) {
    // we can call the mutate function and pass it the formData ( { event: x } is just the shape the backend expects)
    mutate({ event: formData });
    // we don't want to navigate away here because it will happen regardless of success or failure
    // navigate("/events");
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
