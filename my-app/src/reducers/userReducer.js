export const initialState = null;

export const reducer = (state, action) =>{
    if(action.type === "USER"){
        return action.payload
    }

    if(action.type === "CLEAR" ){
        return null;
    }

    if(action.type === "UPLOAD"){
        return{
            ...state,
            followers : action.payload.followers,
            following : action.payload.following
        }
    }

    if(action.type === "UPLOADPIC"){
        return{
            ...state,
            pic : action.payload.pic
        }
    }
    return state;
}