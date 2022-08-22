import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../modules/users/useCases/createUser/ICreateUserDTO";


let authenticateUserUsecase: AuthenticateUserUseCase;
let createUserUsecase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUsecase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository);
    });
    
    it("should be able to authenticate a user", async () => {
        const newUser: ICreateUserDTO = {
            name: "User Name",
            email: "user@email.com",
            password: "654321",
        }
        const createdUser = await createUserUsecase.execute(newUser);

        const {user, token} = await authenticateUserUsecase.execute({
            email: newUser.email,
            password: newUser.password,
        })

        expect(user.email).toEqual(createdUser.email);
        expect(user.name).toEqual(createdUser.name);
        expect(token).toBeDefined();
    });

    it("should not be able to authenticate a non-existing user", async () => {
        const anotherUser = await createUserUsecase.execute({
            name: "Lance Wilson",
            email: "mynameissweet@gmail.com",
            password: "Pier69"
        });
        expect(async () => {
            await authenticateUserUsecase.execute({
                email: anotherUser.email,
                password: "wrongpassword",
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
            expect(async () => {
            await authenticateUserUsecase.execute({
                email: "wrongemail",
                password: anotherUser.password,
            })   
        })
    })

});