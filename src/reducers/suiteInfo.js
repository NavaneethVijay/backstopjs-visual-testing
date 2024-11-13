const suiteInfo = (state = {}, action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    case "SET_SUITE_INFO":
      return{
        ...state,
        idConfig: action.value.id,
        testSuiteName: action.value.testSuite,
      }
    default:
      return state;
  }
};

export default suiteInfo;
