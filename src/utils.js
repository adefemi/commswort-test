export const errorHandler = ({ graphQLErrors, networkError }) => {
  let messageString = "";
  let netError = false;
  if (graphQLErrors) {
    graphQLErrors.map(({ message }, i) => {
      messageString += `${message}<br />`;
      return true;
    });
  }

  if (networkError) {
    messageString += "Network error! check your network and try again";
    netError = true;
  }

  return { message: messageString.replace(/{|}|'|\[|\]/g, ""), netError };
};

// function to add a class to an element
export const addClass = (el, className) => {
  if (!el) {
    return;
  }
  el.classList.add(className);
};

// function to remove a class from an element
export const removeClass = (ele, cls) => {
  if (!ele) {
    return;
  }
  if (hasClass(ele, cls)) {
    ele.classList.remove(cls);
  }
};

export const hasClass = (el, className) => {
  if (!el) {
    return;
  }
  return el.classList.contains(className);
};

export const randomIDGenerator = length => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
