import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase"
import { CreateUserError } from "../../modules/users/useCases/createUser/CreateUserError";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUsecase: CreateUserUseCase;

describe("create a User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository);
    });
    


    it("should be able to create a user", async () => {
        const user = {
            name: "Test User",
            email: "test@example.com",
            password: "123456",
        }

        const createdUser = await createUserUsecase.execute(user);

        expect(createdUser).toHaveProperty("id");
    })

    it("should not be able to create a user if the email already exists", async () => {
        const user = {
            name: "Test User",
            email: "test@example.com",
            password: "123456",
        }
        
        await createUserUsecase.execute(user);
        
        await expect(
             createUserUsecase.execute(user)
        ).rejects.toBeInstanceOf(CreateUserError)
    })
})