import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import validatePassword from '../utils/validatePassword.js';
import validateEmail from '../utils/validateEmail.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';

const userControllers = {
    register: (req, res) => {
        const { email, password, rePassword } = req.body;
        // check if email exists
        const emailExists = User.getByEmail(email);
        if (emailExists) {
            return res.status(400).render('404', {
                title: 'Email already exists',
                message: 'Email already exists'
            });
        }

        // valid email
        const isValidatedEmail = validateEmail(email);
        const isValidatePassword = validatePassword(password);
        const doPasswordsMatch = matchPasswords(password, rePassword);

        if (isValidatedEmail && isValidatePassword && doPasswordsMatch) {
            // hash password
            const hashedPassword = hashPassword(password);
            // create user
            User.add({ email, password: hashedPassword });

            //redirect to login page
            return res.status(302).redirect('api/login');
        } else {
            return res.status(400).render('404', {
                title: 'Invalid email or password',
                message: 'Invalid email or password'
            });
        }
    },

    login: (req, res) => {
        const { email, password } = req.body;
        // check if email exists
        const emailExist = User.getByEmail(email);
        if (!emailExist) {
            return res.status(400).render('404', {
                title: 'Email does not exist ',
                message: 'Email does not exist, please register'
            });
        }
        // check if password matches
        bcrypt.compare(password, emailExist.password, (err, valid) => {
            if (err) {
                console.error(err);
            }

            if (!valid) {
                return res.status(400).render('404', {
                    title: 'Invalid password or email',
                    message: 'Invalid password or mail'
                });
            }

            // create token
            const token = jwt.sign({ email }, process.env.SECRET);

            // set cookie
            res.cookies('token', token, { httpOnly: true });
            // redirect to home page
            res.status(302).redirect('/api/flights');
        });
    },

    logout: (req, res) => {
        // delete token
        res.clearCookie('token');
        // redirect to home page
        res.status(302).redirect('/api/login');
    },

    getRegisterForm: (req, res) => {
        res.status(200).render('register-form');
    },
    getLoginForm: (req, res) => {
        res.status(200).render('login-form');
    }
};

export default userControllers;
