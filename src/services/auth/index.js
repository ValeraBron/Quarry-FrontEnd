const API = import.meta.env.VITE_API_URL

export const signupUser = async ({email, password, confirmPassword}) => {
    try {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)
        formData.append('confirm_password', confirmPassword)

        const res = await fetch(API+'signup', {
            method: 'POST',
            body: formData
        })
        const json = await res.json();
        return json;
    } catch (error) {
        console.log(error)
    }
}

export const signinUser = async ({email, password}) => {
    try {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        const res = await fetch(API+'signin', {
            method: 'POST',
            body: formData
        })
        const json = await res.json();
        return json;
    } catch (error) {
        console.log(error)
    }
}


export const changePassword = async ({token, email, newPassword}) => {
    try {
        const formData = new FormData()
        formData.append('token', token)
        formData.append('email', email)
        formData.append('new_password', newPassword)

        const res = await fetch(API+'change-password', {
            method: 'POST',
            body: formData
        })
        const json = await res.json();
        return json;
    } catch (error) {
        console.log(error)
    }
}
export const confirmEmail = async ({email}) => {
    try {
        const formData = new FormData()
        formData.append('email', email)

        const res = await fetch(API+'confirm-email', {
            method: 'POST',
            body: formData
        })
        const json = await res.json();
        return json;
    } catch (error) {
        console.log(error)
    }
}