export const getSenderName = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  export const getSenderInfo = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
  };


  export const isSameSender = (messages, currentMessage, indexOfCurentMessage, userId) => {
    return (
      indexOfCurentMessage < messages.length - 1 &&
      (messages[indexOfCurentMessage + 1].sender._id !== currentMessage.sender._id 
        || messages[indexOfCurentMessage + 1].sender._id === undefined) &&
        messages[indexOfCurentMessage].sender._id !== userId
        );
  };

  export const isLastMessage = (messages, indexOfCurrentMessage, userId) => {
    return (
      indexOfCurrentMessage === messages.length - 1  && 
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  // message sent by us on the right and message sent by other on left

  export const isSameSenderMargin = (messages, currentMessage, indexOfCurrentMessage, userId) => {
    if (
      indexOfCurrentMessage < messages.length - 1 &&
      messages[indexOfCurrentMessage + 1].sender._id === currentMessage.sender._id &&
      messages[indexOfCurrentMessage].sender._id !== userId
    )
      return 33;
      else {
        return 0; // No margin for single messages or messages from different senders
      }
  };

  export const isSameUser = (messages, currentMessage, indexOfCurrentMessage) => {
    return indexOfCurrentMessage > 0 && messages[indexOfCurrentMessage - 1].sender._id === currentMessage.sender._id;
  };