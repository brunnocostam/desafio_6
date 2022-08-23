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

    it ("should not be able to authenticate a non-existing user because of email", async () => {
        const anotherUser = {
            name: "Lance Wilson",
            email: "mynameisryder@gmail.com",
            password: "imActuallyABalla",
        }

        const anotherCreatedUser = await createUserUsecase.execute(anotherUser);

        
        await expect(
            authenticateUserUsecase.execute({
                email: "imaballa@gmail.com",
                password: anotherUser.password,
            })
        ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })

    
    it("should not be able to authenticate a non-existing user because of password", async () => {
        const otherUser = {
            name: "OGLoc",
            email: "theoglocfella@gmail.com",
            password: "ImmaBeFamous"
        }

        const otherCreatedUser = await createUserUsecase.execute(otherUser);

        await expect(
            authenticateUserUsecase.execute({
                email: otherCreatedUser.email,
                password: "IWannaBeAFamousRapper",
            })
        ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

});